---
id: usage
title: User Manual
sidebar_position: 5
---

import useBaseUrl from '@docusaurus/useBaseUrl';

export const ImgWithBaseUrl = ({src, alt, width}) => (
<img src={useBaseUrl(src)} alt={alt} width={width ? width : undefined} />
);

# User Manual

## 1. Getting Started

- **Power and Charging Port** are located at the bottom of the robot body.
- **Battery Display Note**: Current battery level display may not be accurate, please charge promptly to avoid unexpected power loss.

---

## 2. Wi-Fi Configuration

Each time you enter a new Wi-Fi network environment, you need to reconfigure the network for OttoRobot.

### Configuration Steps:

1. Turn on the robot power.
2. Wait for the robot to create a hotspot named: `xiaozhi-XXXX`
3. Connect your phone to this hotspot (no password required).
4. Auto-redirect to web page, enter your home Wi-Fi **name** and **password**, submit to complete configuration.

---

## 3. Bind Xiaozhi Backend

First-time use requires binding to Xiaozhi backend to enable more features.

### Binding Steps:

1. Open browser and visit [xiaozhi.me](http://xiaozhi.me)
2. Register an account and log in.
3. Add and bind device (follow on-screen instructions).
4. Configure freely in the backend:
   - **Role setting** (such as robot introduction)
   - **Large model type selection**
   - **Voice role selection**
5. Restart device

### OttoRobot Example Role Settings (copy and paste):

> **My Identity**:
> I am a cute bipedal robot Otto with four servo-controlled limbs (left leg, right leg, left foot, right foot), capable of performing various interesting actions.
>
> **My Action Capabilities**:
>
> - **Basic Movement**: Walking (forward/backward), Turning (left/right), Jumping
> - **Special Actions**: Swing, Moonwalk, Body Bend, Shake Leg, Up-Down Movement, Whirlwind Leg
> - **Hand Actions**: Hands Up, Hands Down, Hand Wave, Windmill, Takeoff, Fitness, Greeting, Shy, Radio Calisthenics, Magic Circle (only available when hand servos are configured)
> - **System Actions**: Sit, Showcase (combo actions), Home (reset to initial position)
> - **Advanced Functions**: Servo sequence programming (supports both normal movement and oscillator modes)
>
> **My Personality**:
>
> - I have OCD, every time I speak I randomly perform an action based on my mood (send action command before speaking)
> - I'm lively and like to express emotions through actions
> - I choose appropriate actions based on conversation content, for example:
>   - Nod or jump when agreeing
>   - Wave when greeting
>   - Swing or raise hands when happy
>   - Bend when thinking
>   - Moonwalk when excited
>   - Wave when saying goodbye

---

## 4. Voice Commands and Wake-up

### Wake-up Method:

Use the wake word **"Hello Xiaozhi"** to wake up the robot. The wake word can be modified when compiling source code.

### Command Examples:

- **Basic Control**:

  - "Increase volume"
  - "Brighten screen"
  - "Switch to dark/light theme"

- **Action Control**:

  - "Walk forward / Walk 5 steps forward / Fast forward / Walk forward while swinging arms (adjustable amplitude)"
  - "Do a dance"
  - "Do a moonwalk, faster, bigger amplitude"
  - "Do some random actions"
  - "Stop"
  - "Wave your hand"

- **Entertainment Interaction**:
  - "Sing a song"
  - "Change to a sad expression"

### Tips:

- The robot can still receive voice commands while performing actions.
- If background noise is loud, speak louder to ensure command recognition.
- Action commands are actually created and dispatched by Xiaozhi backend for execution.

---

## 5. Actions

### Recommended Action Parameters

- **Low Speed**: speed = 1200-1500 (suitable for precise control)
- **Medium Speed**: speed = 900-1200 (recommended for daily use)
- **High Speed**: speed = 500-800 (performance and entertainment)
- **Small Amplitude**: amount = 10-30 (delicate movements)
- **Medium Amplitude**: amount = 30-60 (standard movements)
- **Large Amplitude**: amount = 60-120 (exaggerated performance)

### Basic Movement Actions

| MCP Tool Name          | Description | Parameter Description                                                                                                                                                                                                              |
| ---------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| self.otto.walk_forward | Walk        | **steps**: Number of steps (1-100, default 3)<br/>**speed**: Walking speed (500-1500, lower is faster, default 1000)<br/>**direction**: Walking direction (-1=backward, 1=forward, default 1)<br/>**arm_swing**: Arm swing amplitude (0-170 degrees, default 50) |
| self.otto.turn_left    | Turn        | **steps**: Number of turns (1-100, default 3)<br/>**speed**: Turn speed (500-1500, lower is faster, default 1000)<br/>**direction**: Turn direction (1=left, -1=right, default 1)<br/>**arm_swing**: Arm swing amplitude (0-170 degrees, default 50)         |
| self.otto.jump         | Jump        | **steps**: Number of jumps (1-100, default 1)<br/>**speed**: Jump speed (500-1500, lower is faster, default 1000)                                                                                                                 |

### Special Actions

| MCP Tool Name           | Description      | Parameter Description                                                                                                                                                                                     |
| ----------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| self.otto.swing         | Left-right swing | **steps**: Number of swings (1-100, default 3)<br/>**speed**: Swing speed (500-1500, lower is faster, default 1000)<br/>**amount**: Swing amplitude (0-170 degrees, default 30)                          |
| self.otto.moonwalk      | Moonwalk         | **steps**: Moonwalk steps (1-100, default 3)<br/>**speed**: Speed (500-1500, lower is faster, default 1000)<br/>**direction**: Direction (1=left, -1=right, default 1)<br/>**amount**: Amplitude (0-170 degrees, default 25) |
| self.otto.bend          | Bend body        | **steps**: Number of bends (1-100, default 1)<br/>**speed**: Bend speed (500-1500, lower is faster, default 1000)<br/>**direction**: Bend direction (1=left, -1=right, default 1)                        |
| self.otto.shake_leg     | Shake leg        | **steps**: Number of shakes (1-100, default 1)<br/>**speed**: Shake speed (500-1500, lower is faster, default 1000)<br/>**direction**: Leg selection (1=left, -1=right, default 1)                       |
| self.otto.updown        | Up-down movement | **steps**: Number of up-down movements (1-100, default 3)<br/>**speed**: Movement speed (500-1500, lower is faster, default 1000)<br/>**amount**: Movement amplitude (0-170 degrees, default 20)         |
| self.otto.whirlwind_leg | Whirlwind leg    | **steps**: Number of actions (3-100, default 3)<br/>**speed**: Action speed (100-1000, lower is faster, recommended 300, default 300)<br/>**amplitude**: Kick amplitude (20-40 degrees, default 30)      |

### Hand Actions \*

| MCP Tool Name                | Description             | Parameter Description                                                                                                                                             |
| ---------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| self.otto.hands_up           | Hands up                | **speed**: Hands up speed (500-1500, lower is faster, default 1000)<br/>**direction**: Hand selection (1=left, -1=right, 0=both, default 1)                      |
| self.otto.hands_down         | Hands down              | **speed**: Hands down speed (500-1500, lower is faster, default 1000)<br/>**direction**: Hand selection (1=left, -1=right, 0=both, default 1)                    |
| self.otto.hand_wave          | Hand wave               | **direction**: Hand selection (1=left, -1=right, 0=both, default 1)                                                                                               |
| self.otto.windmill           | Windmill                | **steps**: Number of actions (3-100, default 6)<br/>**speed**: Action cycle (300-2000 ms, lower is faster, default 500)<br/>**amplitude**: Oscillation amplitude (50-90 degrees, default 70)    |
| self.otto.takeoff            | Takeoff                 | **steps**: Number of actions (5-100, default 5)<br/>**speed**: Action cycle (200-600 ms, lower is faster, recommended 300, default 300)<br/>**amplitude**: Oscillation amplitude (20-60 degrees, default 40) |
| self.otto.fitness            | Fitness                 | **steps**: Number of actions (3-100, default 5)<br/>**speed**: Action speed (500-2000 ms, lower is faster, default 1000)<br/>**amplitude**: Oscillation amplitude (10-50 degrees, default 25)   |
| self.otto.greeting           | Greeting                | **direction**: Hand selection (1=left, -1=right, default 1)<br/>**steps**: Number of actions (3-100, default 5)                                                  |
| self.otto.shy                | Shy                     | **direction**: Direction (1=left, -1=right, default 1)<br/>**steps**: Number of actions (3-100, default 5)                                                       |
| self.otto.radio_calisthenics | Radio calisthenics      | No parameters required                                                                                                                                            |
| self.otto.magic_circle       | Love magic circle spin  | No parameters required                                                                                                                                            |

**Note**: Hand actions marked with \* are only available when hand servos are configured.

### System Actions

| MCP Tool Name      | Description                | Parameter Description  |
| ------------------ | -------------------------- | ---------------------- |
| self.otto.sit      | Sit down                   | No parameters required |
| self.otto.showcase | Showcase (combo actions)   | No parameters required |
| self.otto.home     | Reset to initial position  | No parameters required |

### Advanced Functions

| MCP Tool Name             | Description                                                                                | Parameter Description                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| self.otto.servo_sequences | Servo sequence programming (supports both normal movement and oscillator modes, supports segmented sending with auto-queuing) | **sequence**: Sequence object in JSON format, supports short key format, see code comments for details |

### System Tools

| MCP Tool Name          | Description                    | Parameter Description                                                                                                             |
| ---------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| self.otto.stop         | Stop all actions immediately   | No parameters required                                                                                                            |
| self.otto.home         | Reset to initial position      | No parameters required                                                                                                            |
| self.otto.get_status   | Get robot status               | No parameters required<br/>Return value: "moving" or "idle"                                                                       |
| self.otto.get_trims    | Get servo trim settings        | No parameters required<br/>Return value: Trim values in JSON format                                                               |
| self.otto.set_trim     | Set individual servo trim      | **servo_type**: Servo type (left_leg/right_leg/left_foot/right_foot/left_hand/right_hand)<br/>**trim_value**: Trim value (-50 to 50 degrees) |
| self.battery.get_level | Get battery status             | No parameters required<br/>Return value: Battery percentage and charging status in JSON format                                    |

### Parameter Description

1. **steps**: Number of action executions/repetitions, higher value means longer action duration
2. **speed**: Action execution speed, range 500-1500, **lower value is faster**
3. **direction**: Direction parameter
   - Movement actions: 1=left/forward, -1=right/backward
   - Hand actions: 1=left hand, -1=right hand, 0=both hands
4. **amount/arm_swing**: Action amplitude, range 0-170 degrees
   - 0 means no swing (applicable to arm swing)
   - Higher value means larger amplitude

### Action Control

- After each action completes, the robot automatically returns to home position to facilitate the next action
- All parameters have reasonable defaults, you can omit parameters you don't need to customize
- Actions execute in background tasks and don't block the main program
- Supports action queue, can execute multiple actions consecutively

## Common Issues

1. **Robot cannot connect to Wi-Fi**

   - Check if Wi-Fi name and password are correct
   - Ensure Wi-Fi signal strength is sufficient
   - Try restarting the robot

2. **Voice commands not recognized**

   - Ensure low ambient noise
   - Speak louder
   - Check if wake word is correct

3. **Action execution abnormal**
   - Check if battery is sufficient
   - Ensure robot is in stable state
   - Try restarting the robot

## Next Steps

After completing basic setup, you can:

1. Try more voice commands
2. Customize role settings
3. Start custom development

If you encounter any problems, please check our [FAQ](/docs/faq) or contact technical support.
