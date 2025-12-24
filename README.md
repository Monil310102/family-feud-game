# 📺 Family Feud: Digital Game Show Engine

A high-performance, keyboard-controlled game engine built with **React** and **TypeScript**. This application is designed to simulate the authentic "Family Feud" experience for live events, complete with dynamic score tracking, strike animations, and automated "Steal Mode" logic.

---

## 🚀 Features

* **Keyboard-Driven Interface:** Optimized for hosts/producers to run the show without a mouse.
* **Intelligent Game Flow:** Automatically detects 3-strike scenarios and switches to "Steal Mode."
* **Dynamic UI:** Neon-inspired design with "Clean AF" visual feedback and backdrop-blurred alerts.
* **Logic-Locked Rounds:** Prevents accidental inputs after a round has been won or failed.
* **Automated Scoring:** Real-time bank accumulation and team score banking.
* **Responsive Sound Engine:** Integration points for "Correct," "Strike," and "Steal" audio cues.

---

## 🛠️ Technical Stack

* **Frontend:** React 18 (Hooks)
* **Typing:** TypeScript
* **Styling:** CSS3 (Flexbox/Grid, Variables, Keyframe Animations)
* **Build Tool:** Vite

---

## 📥 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-link]
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 🎙️ Host & Operator Manual

This section is for the person behind the laptop. To maintain the "magic" of the show, the game is controlled entirely via keyboard shortcuts.

### 🎮 Keyboard Controls Reference

| Key | Action | Context |
| :--- | :--- | :--- |
| **`1` - `9`** | Reveal Answer | Reveals the corresponding answer on the board. |
| **`0`** | Reveal 10th Answer | Used if the round has more than 9 answers. |
| **`X`** | Add Strike | Plays the "Buzzer" and flashes the Big Red X. |
| **`T`** | Toggle Team | Manually swaps the active highlight between Team 1 and 2. |
| **`R`** | Reveal All | Shows every answer at once (Post-round cleanup). |
| **`L`** | End Round | Finalizes the score and prepares the system for the next round. |
| **`N`** | Next Round | Advances the game to the next set of questions. |
| **`E`** | Emergency Reset | Clears strikes and bank if a mistake was made. |
| **`H`** | Hide All | Instantly covers all answers (Use for technical resets). |

---

### 📋 Running a Standard Round

#### 1. The Face-Off
Announce the question. The first team to buzz in gets the floor. Ensure the **Active Team** highlight is on the correct side. If not, press **`T`** to toggle control.

#### 2. Normal Play
As the team gives answers, press **`1` - `8`** to reveal them. The points will automatically add to the **BANK**. If they give a wrong answer, press **`X`**.

#### 3. The 3rd Strike & Steal
When a team hits their 3rd strike, the system will automatically trigger a **STEAL ALERT**. 
* The board will automatically swap control to the opposing team.
* **Steal Success:** If the stealing team gives a correct answer, press the corresponding number. They win the entire bank.
* **Steal Fail:** If the stealing team gets it wrong, press **`X`**. The points are automatically awarded back to the original team.

#### 4. Closing the Round
Once the winner is decided, the game enters a "Locked" state to prevent accidental strikes:
* Press **`R`** to reveal any remaining hidden answers for the audience.
* Press **`L`** to finalize the scores (banks the points to the winning team).
* Press **`N`** to load the next question.

---

## ⚠️ Pro-Tips for the Operator

* **Keyboard Focus:** Ensure the browser window is active. Click once on the background if keys aren't responding.
* **The "L" Key:** The system will "lock" answer reveals after a Steal is completed. You must press **`L`** to move forward.
* **Sound Check:** Ensure your system audio is shared (if using Zoom) or plugged into the PA system to hear the "Strike" and "Reveal" sound effects.
* **Emergency Handling:** Use the **`E`** (Emergency) key to clear strikes and the bank if you accidentally penalized the wrong team.

## 📝 Customizing Questions (MockData)

To use your own questions, edit the file located at `./src/Mockdata/mockData.ts`.

### The Rules of Data Entry:
* **The Limit of 8:** The game board UI is designed to display a maximum of **8 answers** per round. If your data array contains more than 8, only the first 8 will be displayed and accessible.
* **Order of Points:** You must list the answers in order from **highest point value to lowest**. The keyboard keys `1` through `8` map directly to the index of your array.
* **Consistency:** Always ensure `isRevealed` is set to `false` in your mock data file so the game starts with a hidden board.

**Example Entry:**
```typescript
{
  questionText: "Name something people often lose?",
  answers: [
    { text: "KEYS", points: 40, isRevealed: false },
    { text: "REMOTE", points: 30, isRevealed: false },
    { text: "SOCKS", points: 15, isRevealed: false },
    { text: "THEIR MIND", points: 5, isRevealed: false },
  ]
}