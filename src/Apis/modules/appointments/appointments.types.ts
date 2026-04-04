export interface Appointment {
    uid: string;
    doctor_id: string;
    patient_id: string;
    date: string;
    time: string;
    duration: string;
    status: string;
    appointment_type: string | null;
    appointment_status: string;
    patient_name: string;
    patient_image: string | null;
    doctor_name: string;
    symptoms: string | null;
    prescription_uid: string | null;
    prescription_pdf: string | null;
    cancel: boolean;
    mark_complete: boolean;
}

export interface Pagination {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    pageCount: number;
}

export interface AppointmentFilter {
    from_date: string;
    to_date: string;
}

export interface AppointmentListData {
    appointments: Appointment[];
    statistics: Record<string, unknown> | null;
    pagination: Pagination;
    filter: AppointmentFilter[];
}

export interface AppointmentListResponse {
    success: boolean;
    httpStatus: number;
    message: string;
    data: AppointmentListData;
}