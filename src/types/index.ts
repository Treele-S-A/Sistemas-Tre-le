export type Department = 
  | 'TI' 
  | 'Financeiro' 
  | 'Recursos Humanos' 
  | 'Comercial & Vendas' 
  | 'Operações & Engenharia' 
  | 'Diretoria Executiva' 
  | 'Atendimento & SAC' 
  | 'Jurídico & Contratos' 
  | 'Todos';

export type UserRole = 'sysadmin' | 'gestor' | 'colaborador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  department: Department;
  avatarUrl: string;
  jobTitle: string;
  sessionToken: string;
  sessionStartedAt: string;
  mfaVerified: boolean;
  ipAddress: string;
  favoriteSystemIds: string[];
}

export type CategoryId = 
  | 'erp' 
  | 'crm' 
  | 'rh' 
  | 'financeiro' 
  | 'bi' 
  | 'ti' 
  | 'comunicacao' 
  | 'atendimento' 
  | 'juridico';

export interface SystemCategory {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
}

export type SystemStatus = 'operational' | 'maintenance' | 'degraded';
export type SSOProtocol = 'SAML 2.0' | 'OAuth 2.0 / OIDC' | 'OpenID Connect' | 'Kerberos / AD';

export interface EnterpriseSystem {
  id: string;
  name: string;
  shortCode: string;
  category: CategoryId;
  description: string;
  iconName: string;
  url: string;
  ssoProtocol: SSOProtocol;
  allowedDepartments: Department[];
  allowedRoles: UserRole[];
  status: SystemStatus;
  uptimePercent: number;
  responseTimeMs: number;
  lastIncident?: string;
  usageCount: number;
  docUrl: string;
  tags: string[];
  features: string[];
  vendor: string;
  appColor: string;
}

export interface AccessRequest {
  id: string;
  systemId: string;
  systemName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userDepartment: Department;
  justification: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface Announcement {
  id: string;
  title: string;
  type: 'info' | 'maintenance' | 'security';
  date: string;
  author: string;
  content: string;
  urgent?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  systemId: string;
  systemName: string;
  action: 'sso_login' | 'access_requested' | 'permission_updated' | 'system_launched';
  status: 'success' | 'denied' | 'pending';
  ipAddress: string;
}
