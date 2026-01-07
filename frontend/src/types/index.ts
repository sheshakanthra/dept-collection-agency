export interface User {
    username: string;
    role: string;
}

export interface Case {
    id: number;
    case_id: string;
    customer_name: string;
    amount_due: number;
    ageing_days: number;
    priority: 'High' | 'Medium' | 'Low';
    recovery_probability: number;
    status: string;
    sla_hours: number;
}

export interface AuditLog {
    id: number;
    entity: string;
    entity_id: string;
    action: string;
    performed_by: string;
    timestamp?: string; // Optional if not yet in backend
}
