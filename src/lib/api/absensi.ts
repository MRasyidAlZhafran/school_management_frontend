import { api } from '$lib/api/client';

export interface ScanGatePayload {
	kunciQr: string;
}

export interface ScanKelasPayload {
	tokenJadwal: string;
	siswaId: number;
}

export function scanGateAbsensi(payload: ScanGatePayload): Promise<any> {
	return api<any>('/absensi_harian/scan-gate', { method: 'POST', body: payload });
}

export function scanKelasAbsensi(payload: ScanKelasPayload): Promise<any> {
	return api<any>('/absensi_pelajaran/scan-kelas', { method: 'POST', body: payload });
}
