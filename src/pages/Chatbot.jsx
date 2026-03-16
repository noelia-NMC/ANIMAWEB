import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendVeterinaryQuery, validateImage } from '../services/chatbot';
import AnimbotAvatar from '../assets/AnimBot.png';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ChatButton = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #48BBAD 0%, #2E8B7A 100%);
  border: 4px solid white;
  cursor: pointer;
  font-size: 2rem;
  box-shadow: 0 6px 20px rgba(72, 187, 173, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
  padding: 0;

  &:hover {
    transform: scale(1.1);
  }
`;

const ChatWindow = styled.div`
  position: fixed;
  bottom: 8rem;
  right: 2rem;
  width: 400px;
  height: 550px;
  background: white;
  border-radius: 25px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 768px) {
    right: 1rem;
    left: 1rem;
    width: auto;
    bottom: 6rem;
    height: 70vh;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #48BBAD 0%, #3AA99B 100%);
  color: white;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const DoctorIcon = styled.div`
  font-size: 2rem;
`;

const HeaderText = styled.div``;

const DoctorName = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
`;

const DoctorStatus = styled.div`
  font-size: 0.85rem;
  opacity: 0.9;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 1.2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fdfc;
`;

const Message = styled.div`
  padding: 1rem 1.2rem;
  border-radius: 18px;
  max-width: 85%;
  position: relative;
  animation: ${fadeIn} 0.3s;
  line-height: 1.6;
  background: ${(props) =>
    props.$isUser ? 'linear-gradient(135deg, #48BBAD, #3AA99B)' : 'white'};
  color: ${(props) => (props.$isUser ? 'white' : '#2d3748')};
  align-self: ${(props) => (props.$isUser ? 'flex-end' : 'flex-start')};
  border-bottom-right-radius: ${(props) => (props.$isUser ? '6px' : '18px')};
  border-bottom-left-radius: ${(props) => (props.$isUser ? '18px' : '6px')};
  border: ${(props) => (props.$isUser ? 'none' : '1px solid #e2e8f0')};
`;

const TypingIndicator = styled(Message)`
  display: flex;
  gap: 5px;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  background: #48BBAD;
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out both;

  &:nth-child(2) {
    animation-delay: .2s;
  }

  &:nth-child(3) {
    animation-delay: .4s;
  }
`;

const InputContainer = styled.form`
  display: flex;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  gap: 0.8rem;
`;

const ChatInput = styled.input`
  flex: 1;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #48BBAD;
  }
`;

const ActionButton = styled.button`
  padding: 0.9rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #4ECDC4, #44B3A8);
  color: white;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  margin: 0 0.5rem 0.5rem 0;
`;

const PreviewImage = styled.img`
  max-width: 80px;
  max-height: 80px;
  border-radius: 12px;
  border: 2px solid #48BBAD;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          parts: [
            {
              text: '¡Hola! 😊 Soy Dr. AnimBot, tu asistente 🐕‍⚕️ ¿En qué puedo ayudarte hoy?',
            },
          ],
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      alert(`❌ ${validation.error}`);
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!inputValue.trim() && !selectedImage) || isLoading) return;

    const query =
      inputValue.trim() || (selectedImage ? 'Analiza esta imagen, por favor.' : '');

    const userMessage = {
      role: 'user',
      parts: [{ text: imagePreview ? `${query} [📷]` : query }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendVeterinaryQuery(query, messages, selectedImage);

      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: response.reply }] },
      ]);

      if (selectedImage) removeImage();
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: `❌ ${error.message}` }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <ChatWindow $isOpen={isOpen}>
        <ChatHeader>
          <DoctorIcon>🐕‍⚕️</DoctorIcon>
          <HeaderText>
            <DoctorName>Dr. AnimBot</DoctorName>
            <DoctorStatus>Veterinario en línea</DoctorStatus>
          </HeaderText>
        </ChatHeader>

        <ChatBody ref={chatBodyRef}>
          {messages.map((msg, index) => (
            <Message key={index} $isUser={msg.role === 'user'}>
              <Markdown remarkPlugins={[remarkGfm]}>
                {msg.parts?.[0]?.text || ''}
              </Markdown>
            </Message>
          ))}

          {isLoading && (
            <TypingIndicator>
              <Dot />
              <Dot />
              <Dot />
            </TypingIndicator>
          )}
        </ChatBody>

        <InputContainer onSubmit={handleSubmit}>
          <div style={{ flex: 1 }}>
            {imagePreview && (
              <ImagePreviewContainer>
                <PreviewImage src={imagePreview} alt="Vista previa" />
                <RemoveButton type="button" onClick={removeImage}>
                  ×
                </RemoveButton>
              </ImagePreviewContainer>
            )}

            <ChatInput
              placeholder="Pregúntame sobre un caso..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <ActionButton
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="Adjuntar imagen"
          >
            📷
          </ActionButton>

          <ActionButton
            type="submit"
            disabled={isLoading || (!inputValue.trim() && !selectedImage)}
            title="Enviar"
          >
            💚
          </ActionButton>
        </InputContainer>

        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageSelect}
        />
      </ChatWindow>

      <ChatButton onClick={() => setIsOpen(!isOpen)} title="Hablar con Dr. AnimBot">
        {isOpen ? '✕' : <AvatarImage src={AnimbotAvatar} alt="Abrir chat de AnimBot" />}
      </ChatButton>
    </ChatContainer>
  );
}