import { Tag, Typography } from "antd";
import type { IVocabulary } from "types/vocabulary.type";
import styles from './vocabulary-card.module.scss';
import TextToSpeech from "components/common/text-to-speech/text-to-speech.component";
import { useNavigate } from "react-router-dom";

const { Paragraph } = Typography;

interface VocabularyCardProps {
    vocabulary: IVocabulary;
}

const VocabularyCard = ({ vocabulary }: VocabularyCardProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/vocabularies/${vocabulary.id}`);
    }

    return (
        <div className={styles.card} onClick={handleClick}>
            <div className={styles.row}>
                <div className={styles.vocabImage}>
                    <img src={`${vocabulary.image}`} alt={vocabulary.word} />
                </div>
                <div className={styles.vocabInfo}>
                    <Tag color={
                        vocabulary.partOfSpeech === 'noun' ? 'blue' :
                            vocabulary.partOfSpeech === 'verb' ? 'green' :
                                vocabulary.partOfSpeech === 'adjective' ? 'purple' :
                                    vocabulary.partOfSpeech === 'adverb' ? 'red' :
                                        'orange'
                    } className={styles.partOfSpeech}>{vocabulary.partOfSpeech}</Tag>
                    <h2 className={styles.wordTitle}>{vocabulary.word}</h2>
                    <div className={styles.sound}>
                        <p className={styles.pronunciation}>{vocabulary.pronunciation}</p>
                        <TextToSpeech text={vocabulary.word} />
                    </div>
                </div>
            </div>
            <div className={styles.row}>
                <Paragraph ellipsis={{ rows: 2 }}
                    className={styles.definition}>
                    {vocabulary.definitionEn}
                </Paragraph>
            </div>
        </div>
    );
}

export default VocabularyCard