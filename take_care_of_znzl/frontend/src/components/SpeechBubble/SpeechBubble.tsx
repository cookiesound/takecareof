import './SpeechBubble.scss';

interface Props {
  text: string;
}

export default function SpeechBubble({ text }: Props) {
  return (
    <div className="speech-bubble speech-bubble--visible">
      <p>{text}</p>
    </div>
  );
}
