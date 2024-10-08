import gradio as gr
from tts_webui.vocos.vocos_tab_bark import vocos_tab_bark
from tts_webui.vocos.vocos_tab_wav import vocos_tab_wav


def vocos_tabs():
    with gr.Tab("Vocos", id="vocos"):
        vocos_tab_bark()
        vocos_tab_wav()


if __name__ == "__main__":
    with gr.Blocks() as demo:
        vocos_tabs()
    demo.launch()
