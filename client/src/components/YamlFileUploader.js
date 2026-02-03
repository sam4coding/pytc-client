// global FileReader
import React, { Fragment, useContext, useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Divider,
  message,
  Row,
  Select,
  Slider,
  Space,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import yaml from "js-yaml";
import { AppContext } from "../contexts/GlobalContext";
import { YamlContext } from "../contexts/YamlContext";
import {
  getConfigPresets,
  getConfigPresetContent,
  getModelArchitectures,
} from "../utils/api";
import { findCommonPartOfString } from "../utils/utils";

const YamlFileUploader = (props) => {
  const context = useContext(AppContext);
  const YAMLContext = useContext(YamlContext);
  const { type } = props;

  const [yamlContent, setYamlContent] = useState("");
  const [presetOptions, setPresetOptions] = useState([]);
  const [architectureOptions, setArchitectureOptions] = useState([]);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);
  const [isLoadingArchitectures, setIsLoadingArchitectures] = useState(false);

  const sliderData = useMemo(() => {
    if (type === "training") {
      return [
        {
          label: "GPUs",
          min: 0,
          max: 8,
          marks: { 0: 0, 4: 4, 8: 8 },
          value: YAMLContext.numGPUs,
          location: "SYSTEM",
          property: "NUM_GPUS",
          step: 1,
        },
        {
          label: "CPUs",
          min: 1,
          max: 16,
          marks: { 1: 1, 8: 8, 16: 16 },
          value: YAMLContext.numCPUs,
          location: "SYSTEM",
          property: "NUM_CPUS",
          step: 1,
        },
        {
          label: "Learning rate",
          min: 0.00001,
          max: 0.1,
          marks: { 0.00001: 0.00001, 0.01: 0.01, 0.1: 0.1 },
          value: YAMLContext.learningRate,
          location: "SOLVER",
          property: "BASE_LR",
          step: 0.00001,
        },
        {
          label: "Batch size",
          min: 1,
          max: 32,
          marks: { 1: 1, 8: 8, 16: 16, 32: 32 },
          value: YAMLContext.solverSamplesPerBatch,
          location: "SOLVER",
          property: "SAMPLES_PER_BATCH",
          step: 1,
        },
      ];
    }

    return [
      {
        label: "Augmentations",
        min: 1,
        max: 16,
        marks: { 1: 1, 8: 8, 16: 16 },
        value: YAMLContext.augNum,
        location: "INFERENCE",
        property: "AUG_NUM",
        step: 1,
      },
      {
        label: "Batch size",
        min: 1,
        max: 32,
        marks: { 1: 1, 8: 8, 16: 16, 32: 32 },
        value: YAMLContext.inferenceSamplesPerBatch,
        location: "INFERENCE",
        property: "SAMPLES_PER_BATCH",
        step: 1,
      },
    ];
  }, [
    type,
    YAMLContext.numGPUs,
    YAMLContext.numCPUs,
    YAMLContext.learningRate,
    YAMLContext.solverSamplesPerBatch,
    YAMLContext.augNum,
    YAMLContext.inferenceSamplesPerBatch,
  ]);

  const getCurrentConfig = () =>
    type === "training" ? context.trainingConfig : context.inferenceConfig;

  const setCurrentConfig = (nextContent) => {
    if (type === "training") {
      context.setTrainingConfig(nextContent);
    } else {
      context.setInferenceConfig(nextContent);
    }
    setYamlContent(nextContent);
  };

  const getPathValue = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val.path || val.folderPath || "";
  };

  const updateInputSelectorInformation = (yamlData) => {
    const inputImagePath = getPathValue(context.inputImage);
    const inputLabelPath = getPathValue(context.inputLabel);

    if (!inputImagePath || !inputLabelPath) {
      return;
    }

    const inputPath = findCommonPartOfString(inputImagePath, inputLabelPath);

    yamlData.DATASET = yamlData.DATASET || {};
    yamlData.DATASET.INPUT_PATH = inputPath || yamlData.DATASET.INPUT_PATH;
    yamlData.DATASET.IMAGE_NAME = inputImagePath.replace(inputPath, "");
    yamlData.DATASET.LABEL_NAME = inputLabelPath.replace(inputPath, "");

    const outputPath = getPathValue(context.outputPath);
    if (outputPath) {
      yamlData.DATASET.OUTPUT_PATH = outputPath;
    }
  };


  const syncYamlContext = (yamlData) => {
    if (!yamlData) return;
    if (yamlData.SYSTEM) {
      if (typeof yamlData.SYSTEM.NUM_GPUS === "number") {
        YAMLContext.setNumGPUs(yamlData.SYSTEM.NUM_GPUS);
      }
      if (typeof yamlData.SYSTEM.NUM_CPUS === "number") {
        YAMLContext.setNumCPUs(yamlData.SYSTEM.NUM_CPUS);
      }
    }
    if (yamlData.SOLVER) {
      if (typeof yamlData.SOLVER.BASE_LR === "number") {
        YAMLContext.setLearningRate(yamlData.SOLVER.BASE_LR);
      }
      if (typeof yamlData.SOLVER.SAMPLES_PER_BATCH === "number") {
        YAMLContext.setSolverSamplesPerBatch(
          yamlData.SOLVER.SAMPLES_PER_BATCH,
        );
      }
    }
    if (yamlData.INFERENCE) {
      if (typeof yamlData.INFERENCE.SAMPLES_PER_BATCH === "number") {
        YAMLContext.setInferenceSamplesPerBatch(
          yamlData.INFERENCE.SAMPLES_PER_BATCH,
        );
      }
      if (typeof yamlData.INFERENCE.AUG_NUM === "number") {
        YAMLContext.setAugNum(yamlData.INFERENCE.AUG_NUM);
      }
    }
  };

  const applyYamlData = (yamlData, sourceLabel) => {
    if (!yamlData) {
      message.error("Failed to load YAML configuration.");
      return;
    }

    updateInputSelectorInformation(yamlData);
    const serialized = yaml
      .dump(yamlData, { indent: 2 })
      .replace(/^\s*\n/gm, "");
    setCurrentConfig(serialized);
    syncYamlContext(yamlData);

    if (sourceLabel) {
      message.success(`${sourceLabel} loaded.`);
    }
  };

  const parseYaml = (yamlText, showError = true) => {
    if (!yamlText) return null;
    try {
      return yaml.load(yamlText);
    } catch (error) {
      if (showError) {
        message.error("Error parsing YAML content.");
      }
      return null;
    }
  };

  const handleFileUpload = (file) => {
    context.setUploadedYamlFile(file);
    context.setSelectedYamlPreset(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      const yamlData = parseYaml(contents);
      if (!yamlData) return;
      applyYamlData(yamlData, "YAML file");
    };
    reader.readAsText(file);
  };

  const handlePresetSelect = async (value) => {
    setIsLoadingPresets(true);
    try {
      const res = await getConfigPresetContent(value);
      const yamlData = parseYaml(res.content);
      if (!yamlData) return;
      context.setSelectedYamlPreset(value);
      context.setUploadedYamlFile("");
      applyYamlData(yamlData, "Preset config");
    } catch (error) {
      message.error(error?.message || "Failed to load preset config.");
    } finally {
      setIsLoadingPresets(false);
    }
  };

  const updateYamlValue = (location, property, newValue) => {
    const currentConfig = getCurrentConfig();
    if (!currentConfig) {
      message.warning("Load a preset or upload a YAML file first.");
      return null;
    }
    const yamlData = parseYaml(currentConfig) || {};
    yamlData[location] = yamlData[location] || {};
    yamlData[location][property] = newValue;
    return yamlData;
  };

  const handleSliderChange = (location, property, newValue) => {
    const yamlData = updateYamlValue(location, property, newValue);
    if (!yamlData) return;
    applyYamlData(yamlData);
  };

  const handleArchitectureChange = (value) => {
    const yamlData = updateYamlValue("MODEL", "ARCHITECTURE", value);
    if (!yamlData) return;
    applyYamlData(yamlData, "Model architecture updated");
  };

  useEffect(() => {
    const loadPresets = async () => {
      setIsLoadingPresets(true);
      try {
        const res = await getConfigPresets();
        const options = (res.configs || []).map((configPath) => ({
          value: configPath,
          label: configPath,
        }));
        setPresetOptions(options);
      } catch (error) {
        setPresetOptions([]);
      } finally {
        setIsLoadingPresets(false);
      }
    };

    const loadArchitectures = async () => {
      setIsLoadingArchitectures(true);
      try {
        const res = await getModelArchitectures();
        const options = (res.architectures || []).map((arch) => ({
          value: arch,
          label: arch,
        }));
        setArchitectureOptions(options);
      } catch (error) {
        setArchitectureOptions([]);
      } finally {
        setIsLoadingArchitectures(false);
      }
    };

    loadPresets();
    loadArchitectures();
  }, []);

  useEffect(() => {
    const currentConfig = getCurrentConfig();
    if (currentConfig) {
      setYamlContent(currentConfig);
      const yamlData = parseYaml(currentConfig);
      if (yamlData) {
        syncYamlContext(yamlData);
      }
    }
  }, [context.trainingConfig, context.inferenceConfig, type]);

  const currentArchitecture = useMemo(() => {
    const currentConfig = getCurrentConfig();
    if (!currentConfig) return undefined;
    const yamlData = parseYaml(currentConfig, false);
    return yamlData?.MODEL?.ARCHITECTURE;
  }, [context.trainingConfig, context.inferenceConfig, type]);

  return (
    <div style={{ margin: "10px" }}>
      <Space wrap size={12} style={{ marginBottom: 12 }}>
        <Upload beforeUpload={handleFileUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />} size="small">
            Upload YAML File
          </Button>
        </Upload>
        <Select
          placeholder="Choose a preset config"
          style={{ minWidth: 280 }}
          loading={isLoadingPresets}
          options={presetOptions}
          onChange={handlePresetSelect}
          value={context.selectedYamlPreset || undefined}
          allowClear
          onClear={() => context.setSelectedYamlPreset(null)}
        />
      </Space>

      {(context.uploadedYamlFile || context.selectedYamlPreset) && (
        <div style={{ marginBottom: 12 }}>
          <strong>Loaded:</strong>{" "}
          {context.uploadedYamlFile?.name || context.selectedYamlPreset}
        </div>
      )}

      <Divider style={{ margin: "12px 0" }} />

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div>
            <h4>Model architecture</h4>
            <Space style={{ width: "100%" }} align="start">
              <Select
                placeholder="Select architecture"
                loading={isLoadingArchitectures}
                options={architectureOptions}
                style={{ width: "100%" }}
                value={currentArchitecture}
                onChange={handleArchitectureChange}
                disabled={!yamlContent}
              />
            </Space>
          </div>
        </Col>
      </Row>

      <Divider style={{ margin: "12px 0" }} />

      {yamlContent ? (
        <Row>
          {sliderData.map((param, index) => (
            <Fragment key={index}>
              <Col span={8} offset={2}>
                <div>
                  <Space align="center">
                    <h4 style={{ marginBottom: 0 }}>{param.label}</h4>
                  </Space>
                  <Slider
                    min={param.min}
                    max={param.max}
                    marks={param.marks}
                    value={param.value}
                    onChange={(newValue) =>
                      handleSliderChange(
                        param.location,
                        param.property,
                        newValue,
                      )
                    }
                    step={param.step}
                  />
                </div>
              </Col>
            </Fragment>
          ))}
        </Row>
      ) : (
        <div style={{ color: "#8c8c8c" }}>
          Load a preset or upload a YAML file to unlock the configuration
          controls.
        </div>
      )}
    </div>
  );
};

export default YamlFileUploader;
