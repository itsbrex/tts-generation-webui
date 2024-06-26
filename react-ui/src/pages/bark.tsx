import React from "react";
import { Template } from "../components/Template";
import useLocalStorage from "../hooks/useLocalStorage";
import { AudioOutput } from "../components/AudioComponents";
import Head from "next/head";
import { BarkResult } from "../tabs/BarkResult";
import { BarkInputs } from "../components/BarkInputs";
import { getBarkFuncs } from "../data/getBarkFuncs";
import { generateWithBark } from "../functions/generateWithBark";
import {
  useBarkGenerationParams,
  useBarkResult,
} from "../tabs/BarkGenerationParams";
import { parseFormChange } from "../data/parseFormChange";
import { GenerationHistorySimple } from "../components/GenerationHistory";

const initialHistory = []; // prevent infinite loop
const BarkGenerationPage = () => {
  const [historyData, setHistoryData] = useLocalStorage<BarkResult[]>(
    "barkGenerationHistory",
    initialHistory
  );
  const [barkResult, setBarkResult] = useBarkResult();
  const [barkGenerationParams, setBarkVoiceGenerationParams] =
    useBarkGenerationParams();
  const [loading, setLoading] = React.useState<boolean>(false);

  async function bark() {
    setLoading(true);
    const result = await generateWithBark(barkGenerationParams);
    setBarkResult(result);
    setHistoryData((historyData) => [result, ...historyData]);
    setLoading(false);
  }

  const funcs = getBarkFuncs(
    setBarkVoiceGenerationParams,
    barkGenerationParams
  );

  const handleChange = parseFormChange(setBarkVoiceGenerationParams);

  return (
    <Template>
      <Head>
        <title>Bark - TTS Generation Webui</title>
      </Head>
      <div className="flex w-full flex-col">
        <BarkInputs
          barkGenerationParams={barkGenerationParams}
          setBarkVoiceGenerationParams={setBarkVoiceGenerationParams}
          handleChange={handleChange}
          data={barkResult}
        />
        <div className="flex flex-col space-y-4">
          <button
            className="border border-gray-300 p-2 rounded hover:bg-gray-100"
            onClick={bark}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          <AudioOutput
            audioOutput={barkResult?.audio}
            label="Bark Output"
            funcs={funcs}
            metadata={barkResult}
            filter={["sendToBark", "sendToBarkVoiceGeneration"]}
          />
        </div>

        <GenerationHistorySimple
          name="bark"
          setHistoryData={setHistoryData}
          historyData={historyData}
          funcs={funcs}
          nameKey="history_bundle_name_data"
          filter={["sendToBark", "sendToBarkVoiceGeneration"]}
        />
      </div>
      {/* <pre>{JSON.stringify(barkGenerationParams, null, 2)}</pre> */}
    </Template>
  );
};

export default BarkGenerationPage;
