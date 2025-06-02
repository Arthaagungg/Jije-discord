FROM node:18

# Install FFmpeg
RUN apt update && apt install -y ffmpeg

# Set working directory
WORKDIR /app
COPY . .

# Install dependencies
RUN npm install

# Start the bot
CMD ["node", "src/main.js"]
