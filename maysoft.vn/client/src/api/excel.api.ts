// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from 'lodash'
import * as XLSX from 'xlsx'
// import {lazy} from '@loadable/component'

// const XLSX: any = lazy.lib(() => import('xlsx'))
// const _ : any = lazy.lib(() => import('lodash'))


class ExcelApi {
    getFileNameWithExt = (event: any) => {
    	if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
    		return
    	}
    	const name = event.target.files[0].name
    	const lastDot = name.lastIndexOf('.')

    	const fileName = name.substring(0, lastDot)
    	const ext = name.substring(lastDot + 1)

    	return {
    		fileName,
    		ext
    	}
    }

    readFile = (file?: any, schemas?: any, callback?: (record: any) => void) => {
    	if (schemas) {
    		return this._readFileSchema(file, schemas, callback)
    			.then((d: any[]) => {
    				return d
    			})
    			.catch((error: Error) => {
    				console.log(error)
    			})
    	} else {
    		return this._readFileNoSchema(file)
    			.then((d: any[]) => {
    				return d
    			})
    			.catch((error: Error) => {
    				console.log(error)
    			})
    	}
    }

    toFile(json: any[], outputFile: any) {
    	const wb = XLSX.utils.book_new()
    	const ws = XLSX.utils.json_to_sheet(json)
    	// let cols = Object.keys(json[0])

    	XLSX.utils.book_append_sheet(wb, ws, 'Result')
    	// this._autoColumns(wb.Sheets[0], cols)
    	XLSX.writeFile(wb, `${outputFile.fileName}-2-VAS.xlsx`)
    }

    private _autoColumns = (ws: any, cols: any[]) => {
    	console.log(cols)
    	cols.forEach((col, index) => {
    		ws['!cols'][index + 1] = { auto: 1 } // default col
    	})
    }

    private _toArray = (arrayObject: any[]): any[] => {
    	if (arrayObject && arrayObject.length > 0) {
    		const result = arrayObject.map(obj => {
    			const newArray = Object.keys(obj).map((key) => obj[key])
    			return newArray
    		})
    		return result
    	} else {
    		return []
    	}
    }

    private _readFileNoSchema(file: any): Promise<any[]> {
    	return new Promise((resolve, reject) => {
    		try {
    			this._readFile(file, (excelItems: any[]) => {
    				resolve(excelItems)
    			})
    		} catch (error) {
    			reject(error)
    		}
    	})
    }

    private _readFileSchema(file: any, selector: any, callback?: (record: any) => void): Promise<any[]> {
    	return new Promise((resolve, reject) => {
    		try {
    			this._readFile(file, (items: any[]) => {
    				const excelItems = _.orderBy(items, ['DOCREF', 'TT', 'LINO'])
    				const myFields: string[] = Object.keys(selector)
    				const myColIndexs: number[] = myFields.map((field) => selector[field])
    				const excelFields: string[] = Object.keys(excelItems[0])

    				const result: any[] = excelItems.map((record: any) => {
    					const newObj: any = {}

    					myColIndexs.forEach((colIndex: number, fieldIndex: number) => {
    						const excelField = excelFields[colIndex]
    						const myField = myFields[fieldIndex]

    						const cellValue = record[excelField]
    						newObj[myField] = cellValue
    					})
    					callback && callback(newObj)
    					return newObj
    				})

    				resolve(result)
    			})
    		} catch (error) {
    			reject(error)
    		}
    	})
    }

    private _readFile<T>(file: any, callback: (data: T[]) => void) {
    	const fileReader = new FileReader()

    	fileReader.onload = function (e: any) {
    		let binary = ''
    		const bytes = new Uint8Array(e.target.result)
    		const length = bytes.byteLength
    		for (let i = 0; i < length; i++) {
    			binary += String.fromCharCode(bytes[i])
    		}

    		// call 'xlsx' to read the file
    		const workbook = XLSX.read(binary, { type: 'binary', cellDates: true, cellStyles: true })
    		const first_sheet_name = workbook.SheetNames[0]
    		const worksheet = workbook.Sheets[first_sheet_name]
    		const option: any = { range: 0 }
    		const datanew: any = XLSX.utils.sheet_to_json(worksheet, option)

    		const clean = (obj: any) => {
    			for (const propName in obj) {
    				if (!obj[propName]) {
    					delete obj[propName]
    				}
    			}
    		}
    		clean(datanew)
    		if (callback) {
    			callback(datanew)
    		}
    	}

    	fileReader.readAsArrayBuffer(file)
    }

}

const excelApi = new ExcelApi()
export default excelApi