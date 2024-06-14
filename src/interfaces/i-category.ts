
interface ICategory {
    description: string;
}

interface DisplayableCategory extends ICategory {
    id: string;
    __v: number;
}

export default ICategory;
export { DisplayableCategory };
