# Quick Connect

A real-time video conferencing application built with React Native and WebRTC technology.

## Project Overview

Quick Connect is a mobile-first video conferencing app that enables instant video and audio calls between multiple users. Built with modern web technologies, it provides a lightweight, user-friendly, and secure solution for virtual meetings.

## Features

- **Real-Time Video & Audio**: Peer-to-peer low-latency communication using WebRTC
- **Room Management**: Create and join meeting rooms with unique codes
- **In-Meeting Chat**: Text messages, emojis, and file sharing
- **Screen Sharing**: Share device screen with meeting participants
- **User Authentication**: Secure login with JWT tokens
- **Cross-Platform**: Works on iOS, Android, and web browsers

## Technology Stack

### Frontend (Mobile App)
- **React Native** with Expo for cross-platform development
- **WebRTC** for real-time video/audio streaming
- **React Navigation** for app routing
- **Expo Camera** for device camera access

### Backend (Server)
- **Node.js** with Express.js framework
- **Socket.IO** for real-time signaling and chat
- **MySQL** for data persistence
- **JWT** for secure authentication

### Additional Technologies
- **Firebase Storage** for cloud storage
- **Firebase Auth** for user authentication
- **Firebase Cloud Messaging** for push notifications

## Project Structure

```
Quick-Connect/
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── screens/        # App screens (Home, Call, Profile, Settings)
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API and WebRTC services
│   │   └── utils/          # Helper functions
│   ├── App.js              # Main app component
│   └── package.json        # Mobile app dependencies
├── server/                  # Node.js backend server
│   ├── index.js            # Main server file
│   ├── package.json        # Server dependencies
│   └── .env                # Environment variables
└── Idea.md                 # Project specification document
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Quick-Connect
   ```

2. **Setup the backend server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Setup the mobile app**:
   ```bash
   cd mobile
   npm install
   npm start
   ```

4. **Run on device/simulator**:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## Development Timeline

- **Week 1-2**: Research, UI/UX design, and project setup
- **Week 3-4**: Backend server and signaling system implementation
- **Week 5-6**: WebRTC integration and real-time chat
- **Week 7**: Screen sharing and meeting recording features
- **Week 8**: Testing, bug fixing, and deployment

## Future Enhancements

- AI-based transcription and live translation
- Virtual backgrounds and filters
- Meeting scheduling and calendar integration
- Advanced security features
- Analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Yashveer Singh** - 2024-B-13112007A

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

*Quick Connect - Making video conferencing simple, fast, and reliable.*
