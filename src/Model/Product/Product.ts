export interface GetProduct {
    productId: number,
    name: string,
    description: string,
    displayName: string,
    styleColour: string,
    sku: string,
    cartonBarcode: string,
    cartonQuantity: number,
    packBarcode: string,
    packQuantity: number,
    upcCode: string,
    upcQuantity: number,
    productSizes: string[]
}

export interface CreateProduct {
    name: string,
    description: string,
    displayName: string,
    styleColour: string,
    sku: string,
    cartonBarcode: string,
    cartonQuantity: number,
    packBarcode: string,
    packQuantity: number,
    upcCode: string,
    upcQuantity: number,
    productSizes: string[]
}
