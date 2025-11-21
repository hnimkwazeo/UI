import { useEffect, useState } from 'react';
import { Row, Col, Card, List, message, Spin, Button, Divider, Checkbox, Switch } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { groupBy } from 'lodash';
import type { IRole } from 'types/role.type';
import type { IPermission } from 'types/permission.type';
import { fetchRolesAPI, updateRolePermissionsAPI } from 'services/role.service';
import { fetchPermissionsAPI } from 'services/permission.service';

const PermissionsPage = () => {
    const [roles, setRoles] = useState<IRole[]>([]);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<React.Key[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedRole) {
            const currentPermissionIds = selectedRole.permissions.map(p => p.id);
            setSelectedPermissions(currentPermissionIds);
        } else {
            setSelectedPermissions([]);
        }
    }, [selectedRole]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const query = "page=1&size=1000";
            const [rolesRes, permissionsRes] = await Promise.all([
                fetchRolesAPI(),
                fetchPermissionsAPI(query)
            ]);

            if (rolesRes && rolesRes.data) setRoles(rolesRes.data.result);
            if (permissionsRes && permissionsRes.data) setPermissions(permissionsRes.data.result);

        } catch (error) {
            message.error("Failed to fetch initial data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedRole) {
            message.warning("Please select a role to update.");
            return;
        }
        setIsSubmitting(true);
        try {
            const data = {
                id: selectedRole.id,
                name: selectedRole.name,
                description: selectedRole.description,
                active: selectedRole.active,
                permissionIds: selectedPermissions as number[],
            };
            const res = await updateRolePermissionsAPI(data);
            if (res && res.statusCode === 200) {
                message.success("Permissions updated successfully!");
                const rolesRes = await fetchRolesAPI();
                if (rolesRes && rolesRes.data) {
                    setRoles(rolesRes.data.result);
                    const updatedRole = rolesRes.data.result.find(r => r.id === selectedRole.id);
                    if (updatedRole) setSelectedRole(updatedRole);
                }
            } else {
                message.error(res.message || "Failed to update permissions.");
            }
        } catch (error) {
            message.error("An error occurred while saving.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRoleStatusChange = async (role: IRole, checked: boolean) => {
        try {
            const data = {
                id: role.id,
                name: role.name,
                description: role.description,
                active: checked,
                permissionIds: role.permissions.map(p => p.id),
            };
            const res = await updateRolePermissionsAPI(data);
            if (res && res.statusCode === 200) {
                message.success(`Role "${role.name}" status updated.`);
                await fetchData();
            } else {
                message.error(res.message || "Failed to update role status.");
            }
        } catch (error) {
            message.error("An error occurred while updating status.");
        }
    };

    const groupedPermissions = groupBy(permissions, 'module');

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    return (
        <Row gutter={[16, 16]}>
            <Col span={4} style={{ position: 'relative' }}>
                <Card title="Roles List" style={{ position: 'sticky', top: 110 }}>
                    <List
                        dataSource={roles}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => setSelectedRole(item)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selectedRole?.id === item.id ? '#e6f4ff' : 'transparent',
                                    transition: 'background-color 0.3s',
                                }}
                                actions={[
                                    <Switch
                                        key={`switch-${item.id}`}
                                        checked={item.active}
                                        onChange={(checked, event) => {
                                            event.stopPropagation();
                                            handleRoleStatusChange(item, checked);
                                        }}
                                    />
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.name}
                                // description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>

            <Col span={20}>
                <Card title={`Permissions for: ${selectedRole?.name || 'Please select a role'}`}>
                    {selectedRole && (
                        <>
                            <Checkbox.Group
                                style={{ width: '100%' }}
                                value={selectedPermissions}
                                onChange={(checkedValues) => setSelectedPermissions(checkedValues as React.Key[])}
                            >
                                <Row gutter={[0, 16]}>
                                    {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                                        <Col span={24} key={moduleName}>
                                            <Divider orientation="left" style={{ margin: '0 0 8px 0' }}>{moduleName}</Divider>
                                            <Row>
                                                {perms.map(p => (
                                                    <Col span={12} key={p.id}>
                                                        <Checkbox value={p.id}>{p.name}</Checkbox>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                            <Divider />
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSave}
                                loading={isSubmitting}
                                disabled={!selectedRole}
                                style={{ marginRight: 'auto', marginLeft: 'auto', display: 'block' }}
                            >
                                Save Changes
                            </Button>
                        </>
                    )}
                </Card>
            </Col>
        </Row>
    );
};

export default PermissionsPage;
