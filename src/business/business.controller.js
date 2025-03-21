import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

import Business from "./business.model.js";

export const saveBusiness = async (req,res) => {
    try {
        const data = req.body

        const business = await Business.create({
            name: data.name,
            description: data.description,
            impact: data.impact,
            years: data.years,
            category: data.category
        })

        await business.save()

        res.status(200).json({
            message: "Negocio agregado correctamente.",
            data: business
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al agregar el negocio.",
            error: error.message
        })
    }
}

export const getBusiness = async (req,res) => {
    const {years, category, alfa} = req.query
    const query = {estado:true}
    try {
        if (years) {
            query["years"] = { $gte: parseInt(years) };
        }

        if (category) {
            query.category = category
        }
        let option = {}
        if (alfa === 'A-Z') {
            option = {name:1}
        }else if (alfa === 'Z-A') {
            option = {name:-1}
        }

        const business = await Business.find(query).sort(option);

        res.status(200).json({
            message: "Listado de los negocios agregados:",
            data: business
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener la lista de negocios.",
            error: error.message
        })
    }
}

export const updateBusiness = async (req,res) => {
    try {
        const {id} = req.params
        const {...data} = req.body

        const business = await Business.findByIdAndUpdate(id,data,{new:true})

        res.status(200).json({
            message: "Datos de el negocio actualizado correctamente.",
            business
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar los datos del negocio.",
            error: error.message
        })
    }
}

export const generateReport = async (req, res) => {
    try {
        const businesses = await Business.find(); 

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Negocios');

        worksheet.columns = [
            { header: 'Nombre', key: 'name', width: 30 },
            { header: 'Descripción', key: 'description', width: 40 },
            { header: 'Impacto', key: 'impact', width: 15 },
            { header: 'Años de Experiencia', key: 'years', width: 20 },
            { header: 'Categoría', key: 'category', width: 20 },
            { header: 'Estado', key: 'estado', width: 10 }
        ];

        businesses.forEach(business => {
            worksheet.addRow({
                name: business.name,
                description: business.description,
                impact: business.impact,
                years: business.years,
                category: business.category,
                estado: business.estado ? 'Activo' : 'Inactivo'
            });
        });

        const reportsDir = path.join(process.cwd(), 'Reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const fileName = `reporte_negocios_${Date.now()}.xlsx`;
        const filePath = path.join(reportsDir, fileName);

        await workbook.xlsx.writeFile(filePath);

        res.status(200).json({
            message: 'Reporte generado exitosamente',
            file: `/Reports/${fileName}`
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error al generar el reporte',
            error: error.message
        });
    }
};