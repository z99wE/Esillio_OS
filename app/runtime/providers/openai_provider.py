import base64
from openai import OpenAI

from app.runtime.providers.base_provider import BaseProvider


class OpenAIProvider(BaseProvider):

    def __init__(
        self,
        api_key: str,
        base_url: str,
        model: str,
    ):

        self.model = model

        self.client = OpenAI(
            api_key=api_key,
            base_url=base_url,
        )

    ########################################################

    def generate(
        self,
        prompt: str,
        max_new_tokens: int = 1024,
    ) -> str:

        response = self.client.chat.completions.create(

            model=self.model,

            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],

            max_tokens=max_new_tokens,
        )

        return response.choices[0].message.content

    ########################################################

    def analyze_image(
        self,
        image_path: str,
        prompt: str,
        max_new_tokens: int = 1024,
    ) -> str:

        with open(image_path, "rb") as f:
            image = base64.b64encode(
                f.read()
            ).decode()

        response = self.client.chat.completions.create(

            model=self.model,

            messages=[
                {
                    "role": "user",
                    "content": [

                        {
                            "type": "text",
                            "text": prompt,
                        },

                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{image}"
                            },
                        },
                    ],
                }
            ],

            max_tokens=max_new_tokens,
        )

        return response.choices[0].message.content