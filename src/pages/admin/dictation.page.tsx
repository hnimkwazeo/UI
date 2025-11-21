import { Button, Card, Col, notification, Popconfirm, Row, Space, Spin, Tree } from "antd";
import { useEffect, useRef, useState, type Key } from "react";
import type { DataNode } from "antd/es/tree";
import { fetchCategoriesAPI } from "services/category.service";
import type { ICategory } from "types/category.type";
import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { formatISODate } from "utils/format.util";
import type { IMeta } from "types/backend";
import { deleteDictationAPI, fetchDictationsAPI } from "services/dictation.service";
import type { IDictationTopic } from "types/dictation.type";
import type { IconType } from "antd/es/notification/interface";
import CreateCategoryModal from "components/category/create-category-modal.component";
import UpdateCategoryModal from "components/category/update-category-modal.component";
import CreateDictationModal from "components/dictation/create-dictation-modal.component";
import UpdateDictationModal from "components/dictation/update-dictation-modal.component";
import DictationDetailDrawer from "components/dictation/dictation-detail-drawer.component";

const DictationPage = () => {
    const actionRef = useRef<ActionType>(null);
    const [meta, setMeta] = useState<IMeta>({ page: 1, pageSize: 10, pages: 1, total: 0 });
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [categories, setCategories] = useState<DataNode[]>([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] = useState(false);
    const [categoryToUpdate, setCategoryToUpdate] = useState<ICategory | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [selectedTopic, setSelectedTopic] = useState<IDictationTopic | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

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

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const query: string = 'type=DICTATION';
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

    const onSelectCategory = (selectedKeys: Key[]) => {
        setSelectedCategoryId(selectedKeys.length > 0 ? selectedKeys[0] as number : null);
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

    const handleOpenUpdateModal = (record: IDictationTopic) => {
        setSelectedTopic(record);
        setIsUpdateModalOpen(true);
    };

    const handleFinishUpdate = () => {
        setIsUpdateModalOpen(false);
        actionRef.current?.reload();
    };

    const handleViewDictation = (article: IDictationTopic) => {
        setSelectedTopic(article);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedTopic(null);
    };

    const handleDeleteDictation = async (id: number) => {
        try {
            const res = await deleteDictationAPI(id);
            if (res.status === 204) {
                openNotification(true, res.message || 'Dictation deleted successfully!', 'success')();
                actionRef.current?.reload();
            } else {
                openNotification(true, res.message || 'Failed to delete Dictation.', 'error')();
            }
        } catch (error) {
            openNotification(true, 'An error occurred while deleting Dictation.', 'error')();
        }
    };


    const columns: ProColumns<IDictationTopic>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            search: false,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            sorter: true,
            render: (_, record) => (
                <a onClick={() => handleViewDictation(record)}>
                    {record.title}
                </a>
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
                        title="Delete the Dictation"
                        description={`Are you sure to delete dictation": ${record.title}?`}
                        onConfirm={() => handleDeleteDictation(record.id)}
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
                        <ProTable<IDictationTopic>
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

                                const res = await fetchDictationsAPI(query);

                                if (res && res.data) {
                                    setMeta(res.data.meta);
                                    return {
                                        data: res.data.result,
                                        page: 1,
                                        success: true,
                                        total: res.data.meta.total,
                                    };
                                } else {
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
                                <Button type="primary" key="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    Create
                                </Button>,
                            ]}
                            scroll={{ x: 'max-content' }}
                            headerTitle="Dictation Management"
                        />
                    ) : (
                        <Card><p>Please select a category to view dictation topics.</p></Card>
                    )}
                </Col>

            </Row>
            <CreateCategoryModal
                open={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onFinish={handleFinishCreateCategory}
                treeData={categories}
                type="DICTATION"
            />

            <UpdateCategoryModal
                open={isUpdateCategoryModalOpen}
                onClose={() => setIsUpdateCategoryModalOpen(false)}
                onFinish={handleFinishUpdateCategory}
                treeData={categories}
                initialData={categoryToUpdate}
            />

            <CreateDictationModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onFinish={handleFinishCreate}
                categoryId={selectedCategoryId}
            />

            <UpdateDictationModal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onFinish={handleFinishUpdate}
                initialData={selectedTopic}
            />

            <DictationDetailDrawer
                open={isDrawerOpen}
                onClose={() => handleCloseDrawer()}
                topic={selectedTopic}
            />

            {contextHolder}
        </>
    );
};
export default DictationPage;