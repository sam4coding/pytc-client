import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Button,
  Divider,
  Input,
  InputNumber,
  Modal,
  message,
  Select,
  Space,
  Switch,
} from "antd";
import yaml from "js-yaml";
import { AppContext } from "../contexts/GlobalContext";

const getYamlValue = (data, path) => {
  if (!data) return undefined;
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), data);
};

const cloneObject = (data) => {
  try {
    return structuredClone(data);
  } catch (e) {
    return JSON.parse(JSON.stringify(data));
  }
};

const setYamlValue = (data, path, value) => {
  const next = cloneObject(data || {});
  let cursor = next;
  path.forEach((key, idx) => {
    if (idx === path.length - 1) {
      cursor[key] = value;
    } else {
      if (!cursor[key] || typeof cursor[key] !== "object") {
        cursor[key] = {};
      }
      cursor = cursor[key];
    }
  });
  return next;
};

const CONTROL_SECTIONS = {
  training: [
    {
      title: "System",
      controls: [
        { label: "Distributed training", path: ["SYSTEM", "DISTRIBUTED"], type: "switch" },
        { label: "Parallel mode", path: ["SYSTEM", "PARALLEL"], type: "select", options: ["DP", "DDP"] },
        { label: "Debug mode", path: ["SYSTEM", "DEBUG"], type: "switch" },
      ],
    },
    {
      title: "Model",
      controls: [
        { label: "Block type", path: ["MODEL", "BLOCK_TYPE"], type: "select", options: ["residual", "plain"] },
        { label: "Backbone", path: ["MODEL", "BACKBONE"], type: "select", options: ["resnet", "repvgg", "botnet"] },
        { label: "Normalization", path: ["MODEL", "NORM_MODE"], type: "select", options: ["bn", "sync_bn", "in", "gn", "none"] },
        { label: "Activation", path: ["MODEL", "ACT_MODE"], type: "select", options: ["relu", "elu", "leaky"] },
        { label: "Pooling layer", path: ["MODEL", "POOLING_LAYER"], type: "switch" },
        { label: "Mixed precision", path: ["MODEL", "MIXED_PRECESION"], type: "switch" },
        { label: "Aux output", path: ["MODEL", "AUX_OUT"], type: "switch" },
      ],
    },
    {
      title: "Dataset",
      controls: [
        { label: "2D dataset", path: ["DATASET", "DO_2D"], type: "switch" },
        { label: "Load 2D slices", path: ["DATASET", "LOAD_2D"], type: "switch" },
        { label: "Isotropic data", path: ["DATASET", "IS_ISOTROPIC"], type: "switch" },
        { label: "Drop channels", path: ["DATASET", "DROP_CHANNEL"], type: "switch" },
        { label: "Reduce labels", path: ["DATASET", "REDUCE_LABEL"], type: "switch" },
        { label: "Ensure min size", path: ["DATASET", "ENSURE_MIN_SIZE"], type: "switch" },
        { label: "Pad mode", path: ["DATASET", "PAD_MODE"], type: "select", options: ["reflect", "constant", "symmetric"] },
      ],
    },
    {
      title: "Solver",
      controls: [
        { label: "Optimizer", path: ["SOLVER", "NAME"], type: "select", options: ["SGD", "Adam", "AdamW"] },
        { label: "LR scheduler", path: ["SOLVER", "LR_SCHEDULER_NAME"], type: "select", options: ["MultiStepLR", "CosineAnnealingLR", "StepLR"] },
        { label: "Learning rate", path: ["SOLVER", "BASE_LR"], type: "number", min: 0, step: 0.0001 },
        { label: "Total iterations", path: ["SOLVER", "ITERATION_TOTAL"], type: "number", min: 1 },
        { label: "Save interval", path: ["SOLVER", "ITERATION_SAVE"], type: "number", min: 1 },
        { label: "Validation interval", path: ["SOLVER", "ITERATION_VAL"], type: "number", min: 1 },
        { label: "Weight decay", path: ["SOLVER", "WEIGHT_DECAY"], type: "number", min: 0, step: 0.0001 },
        { label: "Momentum", path: ["SOLVER", "MOMENTUM"], type: "number", min: 0, max: 1, step: 0.01 },
        { label: "Clip gradients", path: ["SOLVER", "CLIP_GRADIENTS", "ENABLED"], type: "switch" },
        { label: "Clip value", path: ["SOLVER", "CLIP_GRADIENTS", "CLIP_VALUE"], type: "number", min: 0 },
      ],
    },
  ],
  inference: [
    {
      title: "Inference",
      controls: [
        { label: "Run singly", path: ["INFERENCE", "DO_SINGLY"], type: "switch" },
        { label: "Unpad output", path: ["INFERENCE", "UNPAD"], type: "switch" },
        { label: "Eval mode", path: ["INFERENCE", "DO_EVAL"], type: "switch" },
        { label: "Blending", path: ["INFERENCE", "BLENDING"], type: "select", options: ["gaussian", "constant"] },
        { label: "Augment mode", path: ["INFERENCE", "AUG_MODE"], type: "select", options: ["mean", "max"] },
        { label: "Test count", path: ["INFERENCE", "TEST_NUM"], type: "number", min: 1 },
        { label: "Batch size", path: ["INFERENCE", "SAMPLES_PER_BATCH"], type: "number", min: 1 },
      ],
    },
  ],
};

const YamlFileEditor = (props) => {
  const context = useContext(AppContext);
  const [yamlContent, setYamlContent] = useState("");
  const [showRaw, setShowRaw] = useState(false);

  const { type } = props;

  const yamlData = useMemo(() => {
    if (!yamlContent) return null;
    try {
      return yaml.load(yamlContent);
    } catch (error) {
      return null;
    }
  }, [yamlContent]);

  const updateYaml = (path, value) => {
    if (!yamlData) return;
    const updated = setYamlValue(yamlData, path, value);
    const updatedText = yaml
      .dump(updated, { indent: 2 })
      .replace(/^\s*\n/gm, "");
    setYamlContent(updatedText);
    if (type === "training") {
      context.setTrainingConfig(updatedText);
    } else {
      context.setInferenceConfig(updatedText);
    }
  };

  const handleTextAreaChange = (event) => {
    const updatedYamlContent = event.target.value;
    setYamlContent(updatedYamlContent);
    if (type === "training") {
      context.setTrainingConfig(updatedYamlContent);
    } else {
      context.setInferenceConfig(updatedYamlContent);
    }
    try {
      yaml.load(updatedYamlContent);
    } catch (error) {
      message.error("Error parsing YAML content.");
    }
  };

  useEffect(() => {
    if (type === "training") {
      setYamlContent(context.trainingConfig || "");
    }

    if (type === "inference") {
      setYamlContent(context.inferenceConfig || "");
    }
  }, [
    context.uploadedYamlFile,
    context.trainingConfig,
    context.inferenceConfig,
    type,
  ]);

  const displayName =
    context.uploadedYamlFile?.name || context.selectedYamlPreset;


  const renderControl = (control) => {
    const value = getYamlValue(yamlData, control.path);

    if (control.type === "switch") {
      return (
        <Switch
          checked={Boolean(value)}
          onChange={(checked) => updateYaml(control.path, checked)}
        />
      );
    }

    if (control.type === "select") {
      return (
        <Select
          value={value}
          onChange={(val) => updateYaml(control.path, val)}
          options={control.options.map((option) => ({
            value: option,
            label: option,
          }))}
          style={{ minWidth: 180 }}
        />
      );
    }

    if (control.type === "number") {
      return (
        <InputNumber
          value={typeof value === "number" ? value : undefined}
          min={control.min}
          max={control.max}
          step={control.step || 1}
          onChange={(val) => {
            if (val === null) return;
            updateYaml(control.path, val);
          }}
        />
      );
    }

    return null;
  };

  const sections = CONTROL_SECTIONS[type] || [];

  return (
    <div style={{ padding: "12px 16px" }}>
      {displayName && (
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ marginBottom: 8 }}>{displayName}</h3>
        </div>
      )}
      {!yamlContent ? (
        <div style={{ color: "#8c8c8c" }}>
          Load a preset or upload a YAML file to edit advanced settings.
        </div>
      ) : (
        <>
          {sections.map((section) => (
            <div key={section.title} style={{ marginBottom: 16 }}>
              <Divider orientation="left" style={{ margin: "12px 0" }}>
                {section.title}
              </Divider>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 16,
                }}
              >
                {section.controls.map((control) => (
                  <div
                    key={control.path.join(".")}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "8px 10px",
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 13 }}>{control.label}</span>
                    </div>
                    <div style={{ width: "100%" }}>{renderControl(control)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Space style={{ marginBottom: 8 }}>
            <Button size="small" onClick={() => setShowRaw(true)}>
              Open raw YAML
            </Button>
          </Space>
          <Modal
            open={showRaw}
            onCancel={() => setShowRaw(false)}
            footer={null}
            width={900}
            style={{ top: 48 }}
            styles={{
              body: {
                height: "70vh",
                padding: "16px 20px 20px",
              },
            }}
            title={displayName ? `Raw YAML — ${displayName}` : "Raw YAML"}
          >
            <Input.TextArea
              value={yamlContent}
              onChange={handleTextAreaChange}
              style={{ height: "100%", fontFamily: "monospace" }}
            />
          </Modal>
        </>
      )}
    </div>
  );
};
export default YamlFileEditor;
