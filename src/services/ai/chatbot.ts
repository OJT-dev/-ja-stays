/**
 * Chatbot service for Jamaican property inquiries
 * Incorporates Csikszentmihalyi's flow state and Lennon's creativity
 */
export class ChatbotService {
  private static jamaicanGreetings = [
    "Wah gwaan, mi bredren!",
    "Respect, how can I help?",
    "Big up yuhself! What's the vibes?",
    "Irie! Let's chat about your stay"
  ];

  /**
   * Get a creative Jamaican greeting
   */
  static getGreeting(): string {
    // Lennon-inspired creative randomness
    return this.jamaicanGreetings[
      Math.floor(Math.random() * this.jamaicanGreetings.length)
    ];
  }

  /**
   * Handle user inquiry with flow-state design
   * @param inquiry - User's question or request
   * @returns Response that maintains conversation flow
   */
  static handleInquiry(inquiry: string): string {
    // Csikszentmihalyi-inspired flow state design
    const inquiryLower = inquiry.toLowerCase();
    
    if (inquiryLower.includes('price') || inquiryLower.includes('cost')) {
      return "Let me check the best rates for you, one moment...";
    }
    
    if (inquiryLower.includes('availability') || inquiryLower.includes('book')) {
      return "Checking the calendar for you, hold tight!";
    }
    
    if (inquiryLower.includes('amenities') || inquiryLower.includes('features')) {
      return "Let me list out all the irie features for you...";
    }
    
    // Lennon-inspired creative fallback
    return "No problem, mi soon sort it out! Could you tell me more about what you're looking for?";
  }

  /**
   * Provide property recommendations
   * @param preferences - User's preferences
   * @returns Creative recommendation response
   */
  static recommendProperty(preferences: {
    location?: string;
    budget?: number;
    amenities?: string[];
  }): string {
    // Lennon-inspired creative response
    let response = "Based on what you're saying, I'd recommend ";
    
    if (preferences.location?.toLowerCase().includes('montego bay')) {
      response += "a beachfront villa in Mobay - perfect for that Caribbean vibe!";
    } else if (preferences.location?.toLowerCase().includes('kingston')) {
      response += "a modern apartment in the heart of Kingston - great for city explorers!";
    } else {
      response += "a cozy cottage in the Jamaican countryside - pure relaxation!";
    }
    
    return response;
  }
}
