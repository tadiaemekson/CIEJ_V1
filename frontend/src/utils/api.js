const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    async getHeaders() {
        const token = localStorage.getItem('ciej_token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = await this.getHeaders();
        const config = {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const error = new Error(data.message || 'Something went wrong');
                error.status = response.status;
                error.errors = data.errors || null;
                throw error;
            }

            return data;
        } catch (err) {
            console.error(`API Error on ${endpoint}:`, err);
            throw err;
        }
    }

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    post(endpoint, body, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put(endpoint, body, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

export const api = new ApiClient();
