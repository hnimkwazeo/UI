import { useState, useEffect, useCallback } from 'react';
import { Input, Button, Card, Typography, message, Tag, AutoComplete, Row, Skeleton, List, Col } from 'antd';
import { SearchOutlined, ClockCircleOutlined, PlusCircleOutlined, BulbOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import styles from './dictionary.page.module.scss';
import { searchDictionaryAPI } from 'services/dictionary.service';
import { fetchRecentNotebookAPI } from 'services/notebook.service';
import type { IVocabulary } from 'types/vocabulary.type';
import SearchResult from 'components/vocabulary/search-result.component';
import VocabularyCard from 'components/vocabulary/vocabulary-card.component';
import { useMediaQuery } from 'react-responsive';

const { Title, Text } = Typography;

const LOCAL_STORAGE_KEY = 'dictionarySearchHistory';
interface IQuote {
    id: number;
    title: string;
    content: string;
}

const DictionaryPage = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<IVocabulary[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [recentlyAdded, setRecentlyAdded] = useState<IVocabulary[]>([]);
    const [options, setOptions] = useState<{ value: string }[]>([]);
    const [qoute, setQoute] = useState<IQuote | null>(null);

    const md = useMediaQuery({ maxWidth: 991.98 });
    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedHistory) setSearchHistory(JSON.parse(storedHistory).slice(0, md ? 10 : 30));
        } catch (error) {
            console.error("Failed to parse search history", error);
        }

        const getRecentWords = async () => {
            try {
                const res = await fetchRecentNotebookAPI();
                if (res && res.data) setRecentlyAdded(res.data.result);
            } catch (error) {
                message.error(t('errors.fetchRecentWords'));
            }
        };
        getRecentWords();
    }, [t]);

    useEffect(() => {
        const fetchFact = async () => {
            try {
                const response = await fetch('/qoute/englishFacts.json');
                const allFacts = await response.json();

                const randomIndex = Math.floor(Math.random() * allFacts.length);
                setQoute(allFacts[randomIndex]);
            } catch (error) {

            }
        };
        fetchFact();
    }, []);

    const updateHistory = (newSearchTerm: string) => {
        setSearchHistory(prevHistory => {
            const term = newSearchTerm.toLowerCase().trim();
            if (!term) return prevHistory;
            const filteredHistory = prevHistory.filter(item => item.toLowerCase() !== term);
            const updatedHistory = [term, ...filteredHistory].slice(0, 30);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
            return updatedHistory;
        });
    };

    const handleSearch = async (wordToSearch: string) => {
        const term = wordToSearch.trim();
        if (!term) {
            setSearchResults(null);
            return;
        }

        setIsLoading(true);
        setSearchResults(null);
        setOptions([]);
        try {
            const res = await searchDictionaryAPI(term);
            if (res && res.data && res.data.result.length > 0) {
                setSearchResults(res.data.result);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            message.error(t('errors.searchWord'));
            setSearchResults([]);
        } finally {
            updateHistory(term);
            setIsLoading(false);
        }
    };

    const handleSuggestionSearch = async (value: string) => {
        if (!value) {
            setOptions([]);
            return;
        }
        try {
            const res = await searchDictionaryAPI(value);
            if (res && res.data && res.data.result) {
                const suggestions = res.data.result.map((item: IVocabulary) => ({ value: item.word }));
                setOptions(suggestions);
            }
        } catch (error) {
            console.error("Failed to fetch suggestions", error);
        }
    };

    const debouncedSuggestionSearch = useCallback(debounce(handleSuggestionSearch, 300), []);

    const onSelectSuggestion = (value: string) => {
        setSearchTerm(value);
        handleSearch(value);
    };

    const handleInputChange = (value: string) => {
        setSearchTerm(value);
        if (value.trim() === '') {
            setSearchResults(null);
            setOptions([]);
        } else {
            debouncedSuggestionSearch(value);
        }
    };

    const renderTags = (words: (string | IVocabulary)[], type: 'history' | 'recent') => (
        <div className={styles.tagSection}>
            <Title level={4}>
                {type === 'history' ? <ClockCircleOutlined /> : <PlusCircleOutlined />}
                {' '}{t(`dictionary.${type}Title`)}
            </Title>
            {words.length > 0 ? (
                words.map((item, index) => {
                    const word = typeof item === 'string' ? item : item.word;
                    return (
                        <Tag key={`${type}-${index}`} className={styles.wordTag} onClick={() => { setSearchTerm(word); handleSearch(word); }}>
                            {word}
                        </Tag>
                    )
                })
            ) : <Text type="secondary"></Text>}
        </div>
    );

    const renderCards = (words: (string | IVocabulary)[], type: 'history' | 'recent') => (
        <div className={styles.tagSection}>
            <Title level={4}>
                {type === 'history' ? <ClockCircleOutlined /> : <PlusCircleOutlined />}
                {' '}{t(`dictionary.${type}Title`)}
            </Title>
            <Row gutter={[10, 10]} className={styles.vocabCards}>
                {words.length > 0 ? (
                    words.slice(0, md ? 2 : 3).map((item, index) => {
                        const word = typeof item === 'string' ? item : item.word;
                        return (
                            <Col key={`${type}-${index}`} xs={24} sm={24} md={12} lg={8} xl={8}>
                                <VocabularyCard key={`${type}-${index}`} vocabulary={item as IVocabulary} />
                            </Col>

                        )
                    })
                ) : <Text type="secondary"></Text>}
            </Row>
        </div>
    );

    const SearchResultSkeleton = () => {
        const skeletonItems = [1, 2];
        return (
            <div className={styles.searchResultContainer}>
                <List
                    itemLayout="vertical"
                    dataSource={skeletonItems}
                    renderItem={(_, index) => (
                        <List.Item key={index}>
                            <Card className={styles.resultCard}>
                                <Row gutter={[24, 24]} align="top">
                                    <Col xs={24} md={8}>
                                        <Skeleton.Image className={styles.skeletonImage} active />
                                    </Col>
                                    <Col xs={24} md={16}>
                                        <Skeleton title={{ width: '60%' }} paragraph={{ rows: 2 }} active />
                                    </Col>
                                </Row>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        );
    };

    return (
        <Card bordered={false} className={styles.dictionaryContainer}>
            <Title level={2} className={styles.pageTitle}>{t('dictionary.title')}</Title>
            <AutoComplete
                className={styles.dictionaryAutocomplete}
                options={options}
                style={{ width: '100%' }}
                onSelect={onSelectSuggestion}
                value={searchTerm}
                onChange={handleInputChange}
            >
                <Input.Search
                    size="large"
                    placeholder={t('dictionary.placeholder')}
                    enterButton={<Button type="primary" icon={<SearchOutlined />}>{t('dictionary.search')}</Button>}
                    onSearch={handleSearch}
                    loading={isLoading}
                    allowClear
                />
            </AutoComplete>

            <div className={styles.contentArea}>
                {isLoading ? <SearchResultSkeleton /> : (
                    searchResults ? (
                        <SearchResult results={searchResults} searchTerm={searchTerm} />
                    ) : (
                        <>
                            <div className={styles.quote}>
                                <Typography.Title level={4}>
                                    <BulbOutlined style={{ color: '#fadb14', marginRight: 8 }} />
                                    Fact
                                </Typography.Title>
                                <Typography.Text className={styles.quoteTitle} strong>{qoute?.title}</Typography.Text>
                                <Typography.Paragraph className={styles.quoteContent} style={{ marginTop: 4 }}>
                                    {qoute?.content}
                                </Typography.Paragraph>
                            </div>

                            {renderTags(searchHistory, 'history')}
                            {renderCards(recentlyAdded, 'recent')}

                        </>
                    )
                )}
            </div>
        </Card>
    );
};

export default DictionaryPage;
