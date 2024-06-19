import { useEffect, useState } from "react";

type FetchError = {
    status?: number;
    message: string;
};

function useFetch<T>(fetchFn: () => Promise<T>, dependencies: any[]) {
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<FetchError | null>(null);
    const [fetchedData, setFetchedData] = useState<T | null>(null);

    useEffect(() => {
        async function fetchData() {
            setIsFetching(true);
            setError(null); // Reset error state before fetch
            try {
                const data = await fetchFn();
                setFetchedData(data);
            } catch (error: any) {
                console.log(error as object);
                // Assuming the error can be any type, we ensure it has a message
                const fetchError: FetchError = {
                    status: error?.statusCode || 500, // Default status if not provided
                    message: error?.message || 'Failed to fetch data'
                };
                setError(fetchError);
            } finally {
                setIsFetching(false);
            }
        }
        fetchData();
    }, dependencies);

    return {
        isFetching,
        error,
        fetchedData
    };
}

export default useFetch;
