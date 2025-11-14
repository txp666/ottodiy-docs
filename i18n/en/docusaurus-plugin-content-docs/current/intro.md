---
sidebar_position: 1
---

# Tenengla AI Desktop Humanoid Robot

The Tenengla AI Desktop Humanoid Robot is an open-source DIY robot with a cute appearance and rich features, making it perfect for educational purposes and personal maker projects. This website focuses on sharing the design philosophy and technical principles of the Tenengla AI Desktop Humanoid Robot, helping more people quickly get started with desktop AI robots, bringing robots and artificial intelligence into the physical world and into homes as fun, interesting, and practical super intelligent assistants.

![Tenengla AI Desktop DIY Humanoid Robot](/img/ottoRobot2.png)

## What is the Tenengla AI Desktop Humanoid Robot?

This robot is inspired by the Otto DIY open-source project created by Camilo Parra Palacio in 2016. Through self-developed edge algorithms, appearance design, mechanical structures, combined with 3D printing and the concept of creating everything with electronic components, Tenengla's R&D team enables even beginners to build their own desktop AI robot in just 30 minutes at ultra-low cost! Through a cloud-integrated architecture, the desktop robot is equipped with AI voice dialogue, AI motion feedback, AI vision system and other capabilities. The product deeply integrates multiple scenarios such as emotional companionship, maker education, 3D printing, AI large models, embodied intelligence, and smart home. It supports one-click integration with mainstream AI services such as Tenengla AI, Xiaozhi AI, Tuya Smart, and Volcano Engine. It is an intelligent ecosystem hardware platform for AI desktop robots. Our goal is to significantly lower the barrier to AI robot creation, allowing AI and robots to truly enter the physical world and into homes.

### Xiaozhi AI Implemented Features

- **Multiple Networking Methods**: Supports Wi-Fi and ML307 Cat.1 4G connectivity
- **Smart Interaction**: Voice, BOOT key wake-up and interruption, supports click and long press triggering
- **Offline Voice Wake-up**: Using ESP-SR technology, wake-up without internet connection
- **Streaming Voice Dialogue**: Supports real-time conversation via WebSocket or UDP protocol
- **Multi-language Recognition**: Supports five languages - Mandarin, Cantonese, English, Japanese, Korean (SenseVoice)
- **Voiceprint Recognition**: Can identify who is calling the AI (3D Speaker technology)
- **High-quality Voice Synthesis**: Integrated with Volcano Engine or CosyVoice large model TTS
- **AI Brain**: Integrated with large language models such as Qwen, DeepSeek, Doubao
- **Personalization**: Configurable prompts and voice tones to create custom characters
- **Memory Function**: Has short-term memory, self-summarizes after each conversation
- **Visual Display**: Supports OLED/LCD displays, can show signal strength or conversation content
- **Expression System**: LCD can display rich expression images
- **Multi-language Interface**: Supports multiple languages including Chinese and English

### Tuya Smart AI Implemented Features

- **Smart Home Control**: Supports voice control of Tuya's entire smart home ecosystem
- **Multiple Networking Methods**: Supports Wi-Fi and ML307 Cat.1 4G connectivity
- **Smart Interaction**: Voice, BOOT key wake-up and interruption, supports click and long press triggering
- **Offline Voice Wake-up**: Using ESP-SR technology, wake-up without internet connection
- **Streaming Voice Dialogue**: Supports real-time conversation via WebSocket or UDP protocol
- **Multi-language Recognition**: Supports five languages - Mandarin, Cantonese, English, Japanese, Korean (SenseVoice)
- **Voiceprint Recognition**: Can identify who is calling the AI (3D Speaker technology)
- **High-quality Voice Synthesis**: Integrated with Volcano Engine or CosyVoice large model TTS
- **AI Brain**: Integrated with large language models such as Qwen, DeepSeek, Doubao
- **Personalization**: Configurable prompts and voice tones to create custom characters
- **Memory Function**: Has short-term memory, self-summarizes after each conversation
- **Visual Display**: Supports OLED/LCD displays, can show signal strength or conversation content
- **Expression System**: LCD can display rich expression images
- **Multi-language Interface**: Supports multiple languages including Chinese and English

### Tenengla AI Service Implemented Features (Beta)

- **Multiple Networking Methods**: Supports Wi-Fi and ML307 Cat.1 4G connectivity
- **Smart Interaction**: Voice, BOOT key wake-up and interruption, supports click and long press triggering
- **Offline Voice Wake-up**: Using ESP-SR technology, wake-up without internet connection
- **Streaming Voice Dialogue**: Supports real-time conversation via WebSocket or UDP protocol
- **Multi-language Recognition**: Supports multiple languages including Mandarin, Cantonese, English, Japanese, Korean, Russian, Spanish, Arabic, Vietnamese, Italian, Ukrainian, and more
- **Voiceprint Recognition**: Can identify who is calling the AI (3D Speaker technology)
- **High-quality Voice Synthesis**: Integrated with Volcano Engine, CosyVoice large model and other TTS
- **AI Brain**: Integrated with Tenengla SuperCat LLM2, Qwen, DeepSeek, Doubao, Wenxin Yiyan and other large language models
- **Personalization**: Configurable prompts and voice tones to create custom characters
- **Memory Function**: Has short-term and long-term memory (optional), self-summarizes after each conversation
- **Visual Display**: Supports OLED/LCD displays, can show signal strength or conversation content
- **Expression System**: LCD can display rich expression images
- **Multi-language Interface**: Supports multiple languages including Chinese and English

### Actions

The robot supports a rich action library, including basic movements, special actions, and hand actions (requires hand servo configuration):

| Action Type       | ID  | Description                        | Category       |
| ----------------- | --- | ---------------------------------- | -------------- |
| Walk              | 1   | Walk (forward/backward)            | Basic Movement |
| Turn              | 2   | Turn (left/right)                  | Basic Movement |
| Jump              | 3   | Jump                               | Basic Movement |
| Swing             | 4   | Left-right swing                   | Special Action |
| Moonwalk          | 5   | Moonwalk                           | Special Action |
| Bend              | 6   | Bend body                          | Special Action |
| ShakeLeg          | 7   | Shake leg                          | Special Action |
| UpDown            | 8   | Up-down movement                   | Special Action |
| WhirlwindLeg      | 19  | Whirlwind leg                      | Special Action |
| HandsUp           | 14  | Hands up                           | Hand Action \* |
| HandsDown         | 15  | Hands down                         | Hand Action \* |
| HandWave          | 16  | Hand wave                          | Hand Action \* |
| Windmill          | 20  | Windmill                           | Hand Action \* |
| Takeoff           | 21  | Takeoff                            | Hand Action \* |
| Fitness           | 22  | Fitness                            | Hand Action \* |
| Greeting          | 23  | Greeting                           | Hand Action \* |
| Shy               | 24  | Shy                                | Hand Action \* |
| Sit               | 25  | Sit down                           | System Action  |
| RadioCalisthenics | 26  | Radio calisthenics                 | Hand Action \* |
| MagicCircle       | 27  | Love magic circle spin             | Hand Action \* |
| Showcase          | 28  | Showcase action (combo)            | System Action  |
| Home              | 17  | Reset to initial position          | System Action  |
| ServoSequence     | 18  | Servo sequence (custom programmed) | Advanced       |

**Note**: Hand actions marked with \* are only available when hand servos are configured.

### Action Control

After each action is completed, the robot automatically returns to the home position to facilitate the execution of the next action.

### Wake-up Methods:

Use wake words like **"Hi Miaomiao"**, **"Hello Xiaozhi"**, **"Hello Tuya"** to wake up the robot. Wake words can be modified when compiling the source code.

### Command Examples:

- **Basic Control**:

  - "Increase volume"
  - "Brighten screen"
  - "Switch theme to dark mode / light mode"

- **Action Control**:

  - "Walk forward / Walk 5 steps forward / Fast forward"
  - "Do a dance"
  - "Do a moonwalk, faster"
  - "Do some random actions"
  - "Stop"

- **Entertainment Interaction**:

  - "Sing a song"
  - "Change to a sad expression"

- **MCP Service Integration (Give AI more capabilities)**:
  - "Search for today's gold price"
  - "Search for today's news"
  - "Teach me how to make scrambled eggs with tomatoes"
  - "Tell me a stand-up comedy"
  - "Help me see what Xiaopeng is doing"
  - Integration Method
    - Open Tenengla MCP Service Platform: http://mcp.shanmaotech.cn
    - Copy Xiaozhi AI Agent - Configure Role - Copy MCP endpoint link - Paste into the corresponding MCP service on Tenengla MCP Service Platform - Click start to successfully connect

### Tips:

- The robot can still receive voice commands while performing actions.
- If background noise is loud, speak louder to ensure command recognition.
- Action commands are actually created and dispatched by the AI backend.

## Website Content

On this website, you can find:

- **Complete Tutorials**: Build your own Tenengla AI Desktop Humanoid Robot from scratch
- **Bill of Materials**: All required electronic components and materials
- **Assembly Guide**: Detailed step-by-step illustrations
- **Software Guides**: Detailed MCP service deployment and tutorials
- **Firmware Guides**: ESP32 programming and AI integration tutorials, Tuya T5 programming and AI integration tutorials, etc.
- **Problem Solving**: Solutions to common issues

## Start Building

Ready to build your own Tenengla AI Desktop Humanoid Robot? Click the link below to start your AI robot building journey!

<div class="container">
  <div class="row">
    <div class="col col--6">
      <div class="card">
        <div class="card__header">
          <h3>Beginner's Guide</h3>
        </div>
        <div class="card__body">
          <p>
            Start from scratch, learn about required materials and basic knowledge.
          </p>
        </div>
        <div class="card__footer">
          <a href="/docs/getting-started" class="button button--primary button--block">View Getting Started Guide</a>
        </div>
      </div>
    </div>
    <div class="col col--6">
      <div class="card">
        <div class="card__header">
          <h3>Material Preparation</h3>
        </div>
        <div class="card__body">
          <p>
            View the complete bill of materials and purchasing recommendations.
          </p>
        </div>
        <div class="card__footer">
          <a href="/docs/bom" class="button button--primary button--block">View Bill of Materials</a>
        </div>
      </div>
    </div>
  </div>
</div>
