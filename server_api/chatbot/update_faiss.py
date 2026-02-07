"""
How to update faiss_index:
    1. Delete the existing server_api/chatbot/file_summaries directory
    2. Paste the following prompt into Cursor (or any AI IDE, in agent mode):

        Create markdown files summarizing server_api/main.py and each file in client/src/*/** (including files in nested directories),
        but don't create markdown files for index.js, utils.js, or any CSS files.
        These markdown files will serve as the knowledge base for a RAG chatbot that helps end users navigate the frontend client.
        Put these markdown files in a new server_api/chatbot/file_summaries directory.

    3. Run this script:
        python server_api/chatbot/update_faiss.py
"""

from pathlib import Path
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings

script_directory = Path(__file__).parent.resolve()
summaries_directory = script_directory / "file_summaries"
faiss_directory = script_directory / "faiss_index"
documents = []
for md_file in summaries_directory.rglob("*.md"):
    summary = md_file.read_text(encoding="utf-8")
    relative_path = md_file.relative_to(summaries_directory)
    documents.append(
        Document(
            page_content=summary,
            metadata={"source": str(relative_path)},
        )
    )
embeddings = OllamaEmbeddings(
    model="mistral:latest", base_url="http://cscigpu08.bc.edu:11434"
)
vectorstore = FAISS.from_documents(documents, embeddings)
faiss_directory.mkdir(parents=True, exist_ok=True)
vectorstore.save_local(str(faiss_directory))
