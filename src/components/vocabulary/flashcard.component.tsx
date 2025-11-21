import { useEffect, useState } from 'react';
import { Card, Typography, Image } from 'antd';
import type { IVocabulary } from 'types/vocabulary.type';
import TextToSpeech from 'components/common/text-to-speech/text-to-speech.component';
import styles from './flashcard.module.scss';

const { Title, Text, Paragraph } = Typography;

interface FlashcardProps {
    vocabulary: IVocabulary;
}

const Flashcard = ({ vocabulary }: FlashcardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setIsFlipped(false);
    }, [vocabulary]);

    return (
        <div className={styles.flashcardContainer} onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`${styles.flashcardInner} ${isFlipped ? styles.isFlipped : ''}`}>
                <Card className={`${styles.flashcardFace} ${styles.flashcardFront}`}>
                    <div className={styles.cardContent}>
                        <Title level={2}>{vocabulary.word}</Title>
                        <Text type="secondary" className={styles.phonetic}>{vocabulary.pronunciation}</Text>
                        <TextToSpeech text={vocabulary.word} />
                        <Paragraph type="secondary">{vocabulary.exampleEn}</Paragraph>
                    </div>
                </Card>

                <Card className={`${styles.flashcardFace} ${styles.flashcardBack}`}>
                    <div className={styles.cardContent}>
                        <Image
                            src={vocabulary.image || 'https://placehold.co/400x200?text=Image'}
                            alt={vocabulary.word}
                            className={styles.vocabImage}
                        />
                        <Title level={4} style={{ marginTop: '16px' }}>{vocabulary.meaningVi}</Title>
                        <Paragraph type="secondary">{vocabulary.exampleVi}</Paragraph>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Flashcard;
