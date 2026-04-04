export interface FileUploadResponse {
    fileId: string;
    fileName: string;
    fileUrl: string;
    purpose?: string;
    uploadedAt: string;
}

// Provider List Types
export interface Speciality {
    speciality_id: string;
    uid: string;
    name: string;
}

export interface Qualification {
    qualification_id: string;
    uid: string;
    name: string;
    qualification_from: string | null;
}

export interface DoctorExperience {
    uid: string;
    speciality_id: string;
    years_of_experience: string;
}

export interface TimeSlot {
    start: string;
    end: string;
    wait_time: number;
    time_slot_interval: number;
}

export interface AvailableMinute {
    uid: string;
    cron_expression: string;
    details: string;
    time_range: string; // JSON string array of TimeSlot
    applicable_from: string | null;
    applicable_to: string | null;
    start_time: string;
    end_time: string;
    days: string[];
    latest_date: string | null;
    month_name: string;
    schedule_type: string;
}

export interface Provider {
    uid: string;
    profile_pic: string;
    name: string;
    email: string | null;
    mobile: string | null;
    gender: string;
    dob: string | null;
    summary: string;
    status: string;
    contact_email: string | null;
    contact_mobile: string;
    registration: string | null;
    specialities: Speciality[];
    qualifications: Qualification[];
    doctor_experiences: DoctorExperience[];
    experience_of_number: number;
    fee_amount: number;
    available_minutes: AvailableMinute[];
}

export interface Pagination {
    pageNumber: number;
    pageSize: number;
    totalRecords: string;
    pageCount: number;
}

export interface ProviderListData {
    providers: Provider[];
    pagination: Pagination;
    redirect_to_lab: boolean;
    force_redirect: boolean;
    lab_url: string | null;
}

export interface ProviderListResponse {
    success: boolean;
    httpStatus: number;
    message: string;
    data: ProviderListData;
}