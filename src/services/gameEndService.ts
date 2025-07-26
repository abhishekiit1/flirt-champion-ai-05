interface GameEndResult {
  tagline: string;
  title: string;
  description: string;
}

export class GameEndService {
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateGameEndContent(
    playerName: string,
    finalScore: number,
    targetScore: number,
    difficulty: string,
    chatHistory: Array<{role: string, content: string}>
  ): Promise<GameEndResult> {
    try {
      const won = finalScore >= targetScore;
      const scorePercentage = (finalScore / targetScore) * 100;
      
      const systemPrompt = `Analyze this flirting conversation game and create a fun, personalized game ending for ${playerName}.

GAME STATS:
- Final Score: ${finalScore}/${targetScore} points
- Difficulty: ${difficulty}
- Result: ${won ? 'WON' : 'LOST'}
- Performance: ${scorePercentage.toFixed(1)}% of target

CONVERSATION ANALYSIS:
${chatHistory.map(msg => `${msg.role === 'user' ? playerName : 'AI'}: ${msg.content}`).join('\n')}

Create a witty, personalized game ending that:
- Reflects their actual conversation style and attempts
- Is funny but not mean-spirited
- References specific things they said or tried
- Gives them a memorable tagline based on their performance
- Matches the tone of the difficulty level they played

Format as JSON:
{
  "tagline": "A catchy, personalized tagline (max 6 words)",
  "title": "${won ? 'Victory!' : 'Game Over'} - Performance title",
  "description": "Funny 2-3 sentence description of their game performance with specific references to their attempts"
}`;

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'X-goog-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error('No response content received');
      }

      const parsed = JSON.parse(content);
      return {
        tagline: parsed.tagline || "Conversation Adventurer",
        title: parsed.title || (won ? "Victory!" : "Better Luck Next Time!"),
        description: parsed.description || "You gave it your best shot in this flirting challenge!"
      };

    } catch (error) {
      console.error('Game End Service Error:', error);
      
      // Fallback responses
      const won = finalScore >= targetScore;
      const fallbacks = {
        won: {
          tagline: "Charm Champion",
          title: "Victory! You've Got Game!",
          description: `Congratulations ${playerName}! You scored ${finalScore} points and successfully charmed your way to victory. Your wit and charm were on point!`
        },
        lost: {
          tagline: "Almost Had It",
          title: "Game Over - So Close!",
          description: `Nice try ${playerName}! You scored ${finalScore}/${targetScore} points. Your conversation skills are developing - keep practicing that charm!`
        }
      };
      
      return fallbacks[won ? 'won' : 'lost'];
    }
  }
}