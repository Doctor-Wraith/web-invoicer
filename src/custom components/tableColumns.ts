export const productColumns = [
    {
        key: "name",
        label: "Product Name",
        flex: 2,
    },
    {
        key: "modelNumber",
        label: "Model / SKU",
        flex: 1,
    },
    {
        key: "amount",
        label: "Amount",
        flex: 1,
    },
    {
        key: "cost",
        label: "Unit Price",
        flex: 1.1,
    },
    {
        key: "actions",
        label: "",
        flex: 0.4,
    },
] as const;

export const serviceColumns = [
    {
        key: "name",
        label: "Service Name",
        flex: 2,
    },
    {
        key: "modelNumber",
        label: "Service Code",
        flex: 1,
    },
    {
        key: "amount",
        label: "Hours",
        flex: 1,
    },
    {
        key: "cost",
        label: "Rate",
        flex: 1.1,
    },
    {
        key: "actions",
        label: "",
        flex: 0.4,
    },
] as const;