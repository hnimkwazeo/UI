import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { useEffect, useRef, useState, type Key } from "react";
import type { IMeta } from "types/backend";
import type { DataNode } from "antd/es/tree";
import { Button, Card, Col, notification, Popconfirm, Row, Space, Spin, Tabs, Tag, Tree } from "antd";
import type { IconType } from "antd/es/notification/interface";
import Papa from 'papaparse';
import type { ICategory } from "types/category.type";
import { CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { fetchCategoriesAPI } from "services/category.service";
import CreateCategoryModal from "components/category/create-category-modal.component";
import UpdateCategoryModal from "components/category/update-category-modal.component";
import type { IVocabulary } from "types/vocabulary.type";
import { formatISODate } from "utils/format.util";
import { deleteVocabularyAPI, fetchVocabulariesAPI } from "services/vocabulary.service";
import CreateVocabularyModal from "components/vocabulary/create-vocabulary-modal.component";
import UpdateVocabularyModal from "components/vocabulary/update-vocabulary-modal.component";
import VocabularyDetailDrawer from "components/vocabulary/vocabulary-detail-drawer.component";
import ImportVocabularyModal from "components/vocabulary/import-vocabulary-modal.component";
import type { TabsProps } from "antd/lib";
import QuizDetailView from "components/quiz/quiz-detail-view.component";

const VocabularyPage = () => {
    const actionRef = useRef<ActionType>(null);
    const [meta, setMeta] = useState<IMeta>({
        page: 1,
        pageSize: 10,
        pages: 1,
        total: 0
    });
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [categories, setCategories] = useState<DataNode[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] = useState(false);
    const [categoryToUpdate, setCategoryToUpdate] = useState<ICategory | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [selectedVocabulary, setSelectedVocabulary] = useState<IVocabulary | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [currentPageData, setCurrentPageData] = useState<IVocabulary[]>([]);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, message: string, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: message,
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const mapToDataNode = (cats: ICategory[]): DataNode[] => {
        return cats.map(cat => ({
            title: (
                <Space>
                    <span>{cat.name}</span>
                    <Button icon={<EditOutlined />} size="small" type="text" onClick={() => handleOpenUpdateCategoryModal(cat)} />
                </Space>
            ),
            key: cat.id,
            value: cat.id,
            children: cat.subCategories ? mapToDataNode(cat.subCategories) : [],
        }));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            actionRef.current?.reload();
        }
    }, [selectedCategoryId]);

    const onSelectCategory = (selectedKeys: Key[]) => {
        if (selectedKeys.length > 0) {
            setSelectedCategoryId(selectedKeys[0] as number);
        } else {
            setSelectedCategoryId(null);
        }
    };

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const query: string = 'type=VOCABULARY';
            const res = await fetchCategoriesAPI(query);
            if (res && res.data) {
                const dataNode = mapToDataNode(res.data.result);
                setCategories(dataNode);
            }
        } catch (error) {
            openNotification(true, 'Error fetching categories', 'An error occurred while fetching categories.', 'error')();
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinishCreateCategory = () => {
        setIsCategoryModalOpen(false);
        fetchCategories();
    };

    const handleOpenUpdateCategoryModal = (category: ICategory) => {
        setCategoryToUpdate(category);
        setIsUpdateCategoryModalOpen(true);
    };

    const handleFinishUpdateCategory = () => {
        setIsUpdateCategoryModalOpen(false);
        fetchCategories();
    };

    const handleFinishCreate = () => {
        setIsCreateModalOpen(false);
        actionRef.current?.reload();
    };

    const handleOpenUpdateModal = (record: IVocabulary) => {
        setSelectedVocabulary(record);
        setIsUpdateModalOpen(true);
    };

    const handleFinishUpdate = () => {
        setIsUpdateModalOpen(false);
        actionRef.current?.reload();
    };


    const handleViewArticle = (vocabulary: IVocabulary) => {
        setSelectedVocabulary(vocabulary);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedVocabulary(null);
    };

    const handleExport = () => {
        if (currentPageData.length === 0) {
            openNotification(true, 'No data to export.', 'error')();
            return;
        }
        setIsExporting(true);

        const dataToExport = currentPageData.map(vocabulary => {
            const { category, ...restOfVocab } = vocabulary;

            return {
                ...restOfVocab,
                categoryId: category.id,
            };
        });

        const csv = Papa.unparse(dataToExport, {
            header: true,
        });

        const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `vocabylaries.csv`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        setIsExporting(false);
    };

    const handleFinishImport = () => {
        actionRef.current?.reload();
    };

    const handleDeleteVocabulary = async (id: number) => {
        try {
            const res = await deleteVocabularyAPI(id);
            if (res.status === 204) {
                openNotification(true, 'Delete Vocabulary', res.message || 'Vocabulary deleted successfully!', 'success')();
                actionRef.current?.reload();
            } else {
                openNotification(true, 'Delete Vocabulary', res.message || 'Failed to delete Vocabulary.', 'error')();
            }
        } catch (error) {
            openNotification(true, 'Delete Vocabulary', 'An error occurred while deleting Vocabulary.', 'error')();
        }
    };

    const columns: ProColumns<IVocabulary>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            search: false,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            hideInSearch: true,
            render: (_, record) => (
                <img src={record.image} alt={record.word} style={{ width: '50px', height: '50px' }} />
            ),
        },
        {
            title: 'Word',
            dataIndex: 'word',
            key: 'word',
            ellipsis: true,
            sorter: true,
            render: (_, record) => (
                <a onClick={() => handleViewArticle(record)}>
                    {record.word}
                </a>
            )
        },
        {
            title: 'Pronunciation',
            dataIndex: 'pronunciation',
            key: 'pronunciation',
            ellipsis: true,
            hideInSearch: true,
            render: (_, record) => (
                <>
                    {record.pronunciation}
                </>
            )
        },
        {
            title: 'Part of speech',
            dataIndex: 'partOfSpeech',
            key: 'partOfSpeech',
            ellipsis: true,
            filters: true,
            valueEnum: {
                noun: {
                    text: 'Noun',
                },
                verb: {
                    text: 'Verb',
                },
                adjective: {
                    text: 'Adjective',
                },
                adverb: {
                    text: 'Adverb',
                },
            },
            render: (_, record) => (
                <Tag
                    color={record.partOfSpeech === 'noun' ? 'blue' :
                        record.partOfSpeech === 'verb' ? 'green' :
                            record.partOfSpeech === 'adjective' ? 'purple' :
                                record.partOfSpeech === 'adverb' ? 'red' :
                                    'orange'
                    }
                >
                    {record.partOfSpeech}
                </Tag>
            )
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: true,
            hideInSearch: true,
            render: (value) => {
                return formatISODate(value?.toString() || '');
            },
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            valueType: 'dateRange',
            hideInTable: true,
            hideInSearch: true,
            search: {
                transform: (value) => {
                    return {
                        startCreatedAt: value[0],
                        endCreatedAt: value[1],
                    };
                },
            },
        },
        {
            title: 'Updated at',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: true,
            hideInSearch: true,
            render: (value) => {
                return formatISODate(value?.toString() || '');
            },
        },
        {
            title: 'Action',
            key: 'action',
            search: false,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} color="primary"
                        onClick={() => handleOpenUpdateModal(record)}>
                    </Button>
                    <Popconfirm
                        title="Delete the vocabulary"
                        description={`Are you sure to delete vocabulary": ${record.word}?`}
                        onConfirm={() => handleDeleteVocabulary(record.id)}
                        icon={<QuestionCircleOutlined />}
                        okText="Yes"
                        cancelText="No"
                        placement="leftTop"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const tabItems: TabsProps['items'] = [
        {
            key: 'vocabularies',
            label: 'Vocabulary List',
            children: (
                <ProTable<IVocabulary>
                    columns={columns}
                    actionRef={actionRef}
                    request={async (params, sort, filter) => {
                        const queryParts: string[] = [];
                        queryParts.push(`categoryId=${selectedCategoryId}`);
                        queryParts.push(`page=${params.current}`);
                        queryParts.push(`size=${params.pageSize}`);

                        for (const key in filter) {
                            if (filter[key]) {
                                queryParts.push(`${key}=${filter[key]}`);
                            }
                        }

                        const searchParams = { ...params };
                        delete searchParams.current;
                        delete searchParams.pageSize;

                        for (const key in searchParams) {
                            if (searchParams[key]) {
                                queryParts.push(`${key}=${searchParams[key]}`);
                            }
                        }

                        if (sort) {
                            for (const key in sort) {
                                const value = sort[key];
                                queryParts.push(`sort=${key},${value === 'ascend' ? 'asc' : 'desc'}`);
                            }
                        }

                        const query = queryParts.join('&');

                        const res = await fetchVocabulariesAPI(query);

                        if (res && res.data) {
                            setMeta(res.data.meta);
                            setCurrentPageData(res.data.result);
                            return {
                                data: res.data.result,
                                page: 1,
                                success: true,
                                total: res.data.meta.total,
                            };
                        } else {
                            setCurrentPageData([]);
                            return {
                                data: [],
                                success: false,
                                total: 0,
                            };
                        }
                    }}
                    rowKey="id"
                    pagination={{
                        current: meta.page,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total
                    }}
                    toolBarRender={() => [
                        <Button
                            key="export"
                            icon={<CloudDownloadOutlined />}
                            loading={isExporting}
                            onClick={handleExport}
                        >
                            Export
                        </Button>,
                        <Button
                            key="import"
                            icon={<CloudUploadOutlined />}
                            onClick={() => setIsImportModalOpen(true)}
                        >
                            Import
                        </Button>,
                        <Button type="primary" key="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Create
                        </Button>,
                    ]}
                    scroll={{ x: 'max-content' }}
                    headerTitle="Vocabulary Management"
                />
            ),
        },
        {
            key: 'quizzes',
            label: 'Quiz List',
            children: <QuizDetailView categoryId={selectedCategoryId} type="VOCABULARY" />,
        },
    ];

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card title="Categories" bordered={false} extra={<Button icon={<PlusOutlined />} onClick={() => setIsCategoryModalOpen(true)} />}>
                        {isLoading ? <Spin /> : (
                            <Tree
                                defaultExpandAll
                                showLine
                                onSelect={onSelectCategory}
                                treeData={categories}
                            />
                        )}
                    </Card>
                </Col>
                <Col span={18}>
                    {selectedCategoryId ? (
                        <Tabs type="card" defaultActiveKey="vocabularies" items={tabItems} />
                    ) : (
                        <Card><p>Please select a category to view vocabularies.</p></Card>
                    )}
                </Col>
            </Row>

            <CreateCategoryModal
                open={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onFinish={handleFinishCreateCategory}
                treeData={categories}
                type="VOCABULARY"
            />

            <UpdateCategoryModal
                open={isUpdateCategoryModalOpen}
                onClose={() => setIsUpdateCategoryModalOpen(false)}
                onFinish={handleFinishUpdateCategory}
                treeData={categories}
                initialData={categoryToUpdate}
            />

            <CreateVocabularyModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onFinish={handleFinishCreate}
                categoryId={selectedCategoryId}
            />

            <UpdateVocabularyModal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onFinish={handleFinishUpdate}
                initialData={selectedVocabulary}
            />

            <VocabularyDetailDrawer
                open={isDrawerOpen}
                onClose={() => handleCloseDrawer()}
                vocabulary={selectedVocabulary}
            />

            <ImportVocabularyModal
                open={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onFinish={handleFinishImport}
                categoryId={selectedCategoryId}
            />

            {contextHolder}
        </>
    )
}

export default VocabularyPage