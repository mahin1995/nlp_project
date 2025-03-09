import Category from "../models/Category"


export const getAll =async ()=>{
    return await Category.find({})

}