---
name: react-query-api-codegen
description: "Generate production-ready API code from endpoint + HTTP method + sample response. Creates TypeScript types, API function, React Query hook, and example component in strict order with zero-any enforcement."
---

# React Query API Code Generation

## When to Use This Skill

Use when you have:

- Backend API endpoint (URL + path)
- HTTP method (GET, POST, PUT, DELETE)
- Sample JSON response

Need to generate:

- TypeScript types (strict, no `any`)
- API function using `apiRequest<T>()`
- React Query hook (`useQuery` or `useMutation`)
- Example React component

**Examples:**

- "Generate API code for GET /api/v1/providers endpoint"
- "Create hook for POST /patient/appointments with this response structure"
- "Make mutation + component for DELETE /user/{id}"

---

## Workflow

### Step 1: Type Inference & Generation

**Input:** Sample JSON response from backend

**Output:** Clean TypeScript interfaces

**Rules:**

- Parse the response structure completely
- Identify nested objects and arrays
- Create separate interfaces for each level
- Never use `any` or `unknown`
- Separate response wrapper (if applicable) from inner data
- Use descriptive names matching API domain

**Example:**

```typescript
// Response from API
{
  "status": "success",
  "code": 200,
  "data": {
    "id": "123",
    "name": "Dr. John",
    "specialties": ["cardiology", "pediatrics"],
    "experience": { "years": 15, "verified": true }
  }
}

// Generated types
interface ApiResponse<T> {
  status: string;
  code: number;
  data: T;
}

interface Provider {
  id: string;
  name: string;
  specialties: string[];
  experience: Experience;
}

interface Experience {
  years: number;
  verified: boolean;
}
```

---

### Step 2: API Function Generation

**Input:** Endpoint URL, HTTP method, TypeScript types

**Output:** API function using `apiRequest<T>()`

**Rules:**

- Function name = camelCase version of endpoint
- Accept `payload` parameter for POST/PUT/DELETE
- Endpoint can include path params (e.g., `/api/providers/{id}`)
- url: "organizations/iCZBt3C7/medical-store/zlYskW7k/dashboard", this means url is dynamic organization id and medical store id, so we can accept them as parameters in the function and construct url accordingly
- Use generic type parameter `<T>` for response type
- Return statement should call `apiRequest<T>(method, endpoint, payload?)`

**Example:**

```typescript
// GET /api/v1/providers
export const getProviders = (): Promise<ApiResponse<Provider[]>> =>
  apiRequest<ApiResponse<Provider[]>>("GET", "/api/v1/providers");

// GET /api/v1/providers/{id}
export const getProviderById = (id: string): Promise<ApiResponse<Provider>> =>
  apiRequest<ApiResponse<Provider>>("GET", `/api/v1/providers/${id}`);

// POST /api/v1/providers
export const createProvider = (
  payload: CreateProviderPayload,
): Promise<ApiResponse<Provider>> =>
  apiRequest<ApiResponse<Provider>>("POST", "/api/v1/providers", payload);

// PUT /api/v1/providers/{id}
export const updateProvider = (
  id: string,
  payload: UpdateProviderPayload,
): Promise<ApiResponse<Provider>> =>
  apiRequest<ApiResponse<Provider>>("PUT", `/api/v1/providers/${id}`, payload);

// DELETE /api/v1/providers/{id}
export const deleteProvider = (
  id: string,
): Promise<ApiResponse<{ deleted: boolean }>> =>
  apiRequest<ApiResponse<{ deleted: boolean }>>(
    "DELETE",
    `/api/v1/providers/${id}`,
  );
```

---

### Step 3: React Query Hook Generation

**Input:** API function, TypeScript types, HTTP method

**Output:** Custom hook with consistent signature

**Rules:**

- GET methods → use `useQuery`
- POST/PUT/DELETE methods → use `useMutation`
- Extract response: `response.data.data` (accounts for ApiResponse wrapper)
- Return object with consistent properties:
  - `data`: The inner data (T)
  - `isLoading`: Boolean
  - `error`: Error or null
  - `mutate` (mutations only): Function to trigger mutation
  - `isPending` (mutations only): Boolean alias for isLoading
- Handle Zod validation errors if applicable

**Example:**

```typescript
// GET hook
export const useGetProviders = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: getProviders,
    select: (response) => response.data,
  });

  return { data, isLoading, error };
};

// GET with params
export const useGetProviderById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["provider", id],
    queryFn: () => getProviderById(id),
    enabled: !!id,
    select: (response) => response.data,
  });

  return { data, isLoading, error };
};

// POST mutation
export const useCreateProvider = () => {
  const { mutate, isPending, error, data } = useMutation({
    mutationFn: createProvider,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });

  return {
    mutate,
    isPending,
    error,
    data: data?.data,
  };
};

// DELETE mutation
export const useDeleteProvider = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: deleteProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });

  return { mutate, isPending, error };
};
```

---

### Step 4: Example React Component

**Input:** Custom hook, API function signature

**Output:** Production-ready example component

**Rules:**

- Show hook integration
- Display loading state
- Handle error state
- For mutations: show trigger pattern (button click)
- Include `console.log` for debugging
- Use proper TypeScript typing
- Include minimal styling (tailwind classes)
- Show data rendering with safety checks

**Example:**

```typescript
import { useGetProviders } from "./providers.hooks";

export function ProvidersComponent() {
  const { data, isLoading, error } = useGetProviders();

  if (isLoading) return <div>Loading providers...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("Providers:", data);

  return (
    <div className="space-y-2">
      {data?.map((provider) => (
        <div key={provider.id} className="p-3 border rounded">
          <h3 className="font-semibold">{provider.name}</h3>
          <p className="text-sm text-gray-600">
            {provider.specialties.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}

// Mutation example
import { useCreateProvider } from "./providers.hooks";

export function CreateProviderComponent() {
  const { mutate, isPending, error } = useCreateProvider();

  const handleCreate = () => {
    console.log("Creating provider...");
    mutate({
      name: "Dr. Jane Doe",
      specialties: ["neurology"],
    });
  };

  return (
    <div>
      <button
        onClick={handleCreate}
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Provider"}
      </button>
      {error && <div className="text-red-600 mt-2">{error.message}</div>}
    </div>
  );
}
```

---

## Decision Points

### Query Parameters

If endpoint accepts query params (filters, pagination):

- Accept them as optional object parameter
- Append to URL using URLSearchParams or query string

```typescript
export const getProviders = (filters?: {
  specialty?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Provider[]>> => {
  const params = new URLSearchParams();
  if (filters?.specialty) params.append("specialty", filters.specialty);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const url = `/api/v1/providers${params.toString() ? `?${params}` : ""}`;
  return apiRequest<ApiResponse<Provider[]>>("GET", url);
};
```

### Error Handling in Hooks

If using Zod validation or custom error parsing:

```typescript
export const useCreateProvider = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: createProvider,
    onError: (err: any) => {
      if (err.response?.data?.errors) {
        console.error("Validation errors:", err.response.data.errors);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Provider created!");
    },
  });

  return { mutate, isPending, error };
};
```

### Infinite Queries (Pagination)

If paginated response:

```typescript
export const useProvidersPaginated = () => {
  const { data, fetchNextPage, hasNextPage, isPending, error } =
    useInfiniteQuery({
      queryKey: ["providers"],
      queryFn: ({ pageParam = 1 }) =>
        getProviders({ page: pageParam, limit: 20 }),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      select: (pages) => pages.flatMap((p) => p.data),
    });

  return { data, fetchNextPage, hasNextPage, isPending, error };
};
```

---

## Quality Checklist

Before marking generated code as complete:

- [ ] **Types**: All TypeScript interfaces defined, zero `any`
- [ ] **API Function**: Uses `apiRequest<T>()`, accepts params correctly
- [ ] **Hook**: Returns `{ data, isLoading, error }` consistently
- [ ] **Mutations**: Return `{ mutate, isPending, error }`
- [ ] **Example Component**: Shows loading, error, success states
- [ ] **Naming**: camelCase functions, PascalCase types
- [ ] **Imports**: All dependencies correct (React Query, types)
- [ ] **Query Invalidation**: Mutations invalidate related queries
- [ ] **Error Messages**: Readable user-facing messages

---

## Usage in Codebase

All generated code follows:

1. **API Functions**: `src/Apis/modules/<domain>/` (e.g., `src/Apis/modules/providers/providers.api.ts`)
2. **Types**: `src/Apis/modules/<domain>/<domain>.types.ts` or collocated with API functions
3. **Hooks**: `src/Modules/<Feature>/hooks/use<Function>.ts`
4. **Components**: `src/Modules/<Feature>/components/`

---

## Example Invocation Patterns

**Pattern 1: With endpoint + method + sample response**

```
Generate API code for:
- Endpoint: GET /api/v1/appointments
- Method: GET
- Response: { "status": "success", "data": [{"id": "1", "userId": "u1", "doctorId": "d1", "date": "2024-04-10"}] }
```

**Pattern 2: With path parameters**

```
Generate API code for:
- Endpoint: PUT /api/v1/providers/{id}
- Method: PUT
- Payload: { "name": string, "specialties": string[] }
- Response: { "status": "success", "data": { "id": string, "name": string } }
```

**Pattern 3: With query parameters**

```
Generate API code for:
- Endpoint: GET /api/v1/appointments?userId=X&status=Y
- Method: GET
- Query Params: userId (string), status (enum: pending|confirmed|cancelled)
- Response: { "status": "success", "data": [...] }
```

---

## Related Skills

- **Zod Schema Generation**: For request payload validation
- **Error Handling Pattern**: For consistent error boundaries
- **React Component Architecture**: For splitting container/presentational components
