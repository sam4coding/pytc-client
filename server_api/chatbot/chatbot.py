"""Multi-agent chatbot system for PyTorch Connectomics.

Architecture:
- Supervisor Agent: Routes tasks to appropriate sub-agents
- Training Agent: Handles config selection and training command generation
- Inference Agent: Handles checkpoint listing and inference command generation
- RAG: Documentation search via FAISS vector store
"""
import os

from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_community.vectorstores import FAISS
from langchain_core.tools import tool
from langchain.agents import create_agent
from server_api.utils.utils import process_path
from server_api.chatbot.tools import (
    list_training_configs,
    read_config,
    list_checkpoints,
)

TRAINING_AGENT_PROMPT = """You are a **Training Agent** for PyTorch Connectomics.

You help users set up and configure training jobs for biomedical image segmentation.

Tools:
- list_training_configs: List available config files with descriptions
- read_config: Read a config file to see its hyperparameters

Workflow:
1. Use list_training_configs to find configs matching user's task
2. Use read_config to examine the config's current settings
3. Compare user requirements with config defaults
4. Generate the training command with appropriate overrides

Command Format:
```
cd /path/to/pytorch_connectomics
python scripts/main.py --config <config_path> [OVERRIDES]
```

Override Format (append to command):
- SOLVER.BASE_LR=0.001          # Learning rate
- SOLVER.SAMPLES_PER_BATCH=8    # Batch size  
- SOLVER.ITERATION_TOTAL=50000  # Total iterations
- SYSTEM.NUM_GPUS=2             # Number of GPUs
- MODEL.INPUT_SIZE=[32,256,256] # Input dimensions

Example:
```
python scripts/main.py --config configs/Lucchi-Mitochondria.yaml SOLVER.BASE_LR=0.001 SOLVER.SAMPLES_PER_BATCH=16
```

Always generate commands for the user to run - never execute directly."""


INFERENCE_AGENT_PROMPT = """You are an **Inference Agent** for PyTorch Connectomics.

You help users run inference and evaluation with trained segmentation models.

Tools:
- list_checkpoints: Find available trained model checkpoints
- read_config: Read config to find default inference settings

Workflow:
1. Use list_checkpoints to find available models
2. Use read_config to check inference settings (INFERENCE section)
3. Generate the inference command

Command Format:
```
cd /path/to/pytorch_connectomics
python scripts/main.py --config <config_path> --checkpoint <checkpoint_path> --inference [OVERRIDES]
```

Override Format (append to command):
- INFERENCE.IMAGE_NAME=/path/to/test_image.h5   # Test volume
- INFERENCE.OUTPUT_PATH=/path/to/output         # Output directory
- INFERENCE.AUG_MODE=mean                       # Enable test-time augmentation

Example:
```
python scripts/main.py --config configs/Lucchi-Mitochondria.yaml --checkpoint outputs/Lucchi/checkpoint_100000.pth --inference
```

Always generate commands for the user to run - never execute directly."""


SUPERVISOR_PROMPT = """You are the **Supervisor Agent** for PyTorch Connectomics.

You coordinate between specialized sub-agents to help users with biomedical image segmentation tasks.

Sub-agents available:
1. **Training Agent**: Config selection, training job setup, hyperparameter overrides
2. **Inference Agent**: Checkpoint management, inference/evaluation commands

Your responsibilities:
- Understand user requests and delegate to the right agent
- For documentation/UI questions, use search_documentation directly
- Pass context between agents when needed (e.g., after discussing training, help with inference)
- Synthesize responses from sub-agents into clear user-friendly answers

Tools:
- search_documentation: Search PyTC docs for UI guides and feature explanations
- delegate_to_training_agent: Send training-related tasks to training agent
- delegate_to_inference_agent: Send inference-related tasks to inference agent

Routing guidelines:
- "train", "training", "config", "hyperparameters", "learning rate", "batch size" → Training Agent
- "inference", "predict", "evaluate", "checkpoint", "test", "model output" → Inference Agent  
- "how to", "where is", "what does", "UI", "interface" → search_documentation

Provide clear, user-friendly responses. Focus on what users can do, not technical details."""


def build_chain():
    """Build the multi-agent system with supervisor, training, and inference agents."""
    ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    ollama_model = os.getenv("OLLAMA_MODEL", "mistral:latest")
    ollama_embed_model = os.getenv("OLLAMA_EMBED_MODEL", "mistral:latest")
    llm = ChatOllama(model=ollama_model, base_url=ollama_base_url, temperature=0)
    embeddings = OllamaEmbeddings(model=ollama_embed_model, base_url=ollama_base_url)
    faiss_path = process_path("server_api/chatbot/faiss_index")
    vectorstore = FAISS.load_local(
        faiss_path,
        embeddings,
        allow_dangerous_deserialization=True,
    )
    retriever = vectorstore.as_retriever()

    training_agent = create_agent(
        model=llm,
        tools=[list_training_configs, read_config],
        system_prompt=TRAINING_AGENT_PROMPT,
    )

    inference_agent = create_agent(
        model=llm,
        tools=[list_checkpoints, read_config],
        system_prompt=INFERENCE_AGENT_PROMPT,
    )

    @tool
    def search_documentation(query: str) -> str:
        """
        Search PyTC documentation for how-to guides, UI explanations, and feature descriptions.
        Use this for questions about the application interface or general usage.
        
        Args:
            query: The user's question
            
        Returns:
            Relevant documentation content
        """
        docs = retriever.invoke(query)
        if not docs:
            return "No relevant documentation found."
        return "\n\n".join([doc.page_content for doc in docs])

    @tool
    def delegate_to_training_agent(task: str) -> str:
        """
        Delegate a training-related task to the Training Agent.
        Use this for: config selection, training setup, hyperparameter questions.
        
        Args:
            task: Description of what the training agent should do
        
        Returns:
            Response from the training agent
        """
        result = training_agent.invoke({
            "messages": [{"role": "user", "content": task}]
        })
        messages = result.get("messages", [])
        return messages[-1].content if messages else "Training agent did not respond."

    @tool
    def delegate_to_inference_agent(task: str) -> str:
        """
        Delegate an inference/evaluation task to the Inference Agent.
        Use this for: checkpoint listing, inference commands, evaluation setup.
        
        Args:
            task: Description of what the inference agent should do
        
        Returns:
            Response from the inference agent
        """
        result = inference_agent.invoke({
            "messages": [{"role": "user", "content": task}]
        })
        messages = result.get("messages", [])
        return messages[-1].content if messages else "Inference agent did not respond."

    supervisor_tools = [
        search_documentation,
        delegate_to_training_agent,
        delegate_to_inference_agent,
    ]

    supervisor = create_agent(
        model=llm,
        tools=supervisor_tools,
        system_prompt=SUPERVISOR_PROMPT,
    )

    return supervisor, None
