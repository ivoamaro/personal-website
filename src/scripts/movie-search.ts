

export const getSearchResults = async (
    search: string,
    type?: string,
    year?: string,
    page: number = 1,
) => {
    const apiKey = import.meta.env.OMDB_API_KEY;

    const params = new URLSearchParams({
        apikey: apiKey,
        s: search,
        page: String(page),
    });

    // only add if valid
    if (type) params.append("type", type);
    if (year) params.append("y", year);

    const url = `https://www.omdbapi.com/?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();


    if (data.Response === "False") {
        return {
            results: [],
            error: data.Error,
            totalResults: 0,
            totalPages: 0,
            currentPage: page,
        };
    }

    return {
        results: data.Search ?? [],
        error: null,
        totalResults: data.totalResults,
        totalPages: Math.ceil(data.totalResults / 10),
        currentPage: page,
    };
};




