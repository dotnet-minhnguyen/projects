
import React from 'react'

import { IVAS } from '../models/VAS.interface'
import * as _ from 'lodash'
import excelApi from '../api/excel.api'
// import { lazy } from '@loadable/component'

// const _: any = lazy.lib(() => import('lodash'))

export default class ExcelBrowser extends React.Component {

	GROUP_SCHEMES: any = {
	  DOCREF: 2
	}

	INPUT_SCHEMES_old: any = {
	  LINO: 7,
	  TXSRCE: 4,
	  TT: 5,
	  DOCREF: 6,
	  PSTPER: 9,
	  PRLACC: 11,
	  ADTE08: 15,

	  JOB_NO: 0,
	  CENTER_NO: 1,
	  DEPT_NO: 2,
	  LINDES_NO: 8,
	  ACCN08_NO: 3,

	  CURN08_NO: 12,
	  PSTAMT: 10,

	  ACCN08_CO: 3,
	  JOB_CO: 0,
	  CENTER_CO: 1,
	  DEPT_CO: 2,
	  LINDES_CO: 8,
	}

	INPUT_SCHEMES: any = {
	  DOCREF: 6,
	  ADTE08: 15,
	  NO1: '',

	  NO2: '',
	  NO3: '',

	  ACCN08_NO: 3,
	  ACCN08_CO: 3,

	  PSTAMT: 10,
	  LINDES_NO: 8,


	  LINO: 7,
	  TXSRCE: 4,
	  TT: 5,
	  PSTPER: 9,
	  PRLACC: 11,

	  JOB_NO: 0,
	  CENTER_NO: 1,
	  DEPT_NO: 2,

	  CURN08_NO: 12,

	  JOB_CO: 0,
	  CENTER_CO: 1,
	  DEPT_CO: 2,
	  LINDES_CO: 8,
	}

	state = {
	  numberOfRecord: 0,
	  outputFile: {
	    fileName: '',
	    ext: ''
	  }
	}

	render() {
	  return (
	    <div className="upload">
	      <div>
					Chọn tệp định dạng file Excel
	      </div>
	      <input aria-label='upload file' type="file" name="file" onChange={this.changeHandler} />

	      {
	        this.state.numberOfRecord > 0 &&
					<div>{this.state.numberOfRecord} records</div>
	      }
	      {
	        this.state.outputFile?.fileName && this.state.numberOfRecord === 0 &&
					<div>Reading...</div>
	      }
	    </div>
	  )
	}

	_groupAndCount = async (event: any) => {
	  this._resetState()
	  const outputFile = excelApi.getFileNameWithExt(event)

	  if (outputFile) {
	    this.setState({ outputFile })
	    const schemes = this.GROUP_SCHEMES
	    const file = event.target.files[0]
	    const groupCount = []

	    let docs: IVAS[] = []
	    let docRef: any
	    await excelApi.readFile(file, schemes, (record: IVAS) => {
	      this.setState({ numberOfRecord: this.state.numberOfRecord + 1 })
	      if (!docRef) {
	        docRef = record.DOCREF
	      }
	      if (docRef === record.DOCREF) {
	        docs.push(record)
	      } else {
	        //calculate
	        if (docs?.length) {
	          groupCount.push({ DOC: docs[0].DOCREF, COUNT: docs.length })
	        }


	        //reset docs
	        docRef = record.DOCREF
	        docs = [record]
	      }
	    })
	    //lastone
	    if (docs?.length) {
	      groupCount.push({ DOC: docs[0].DOCREF, COUNT: docs.length })
	    }

	    excelApi.toFile(groupCount, outputFile)
	    this._resetState()
	    this._changeEvent(event)
	  }
	}

	changeHandler = async (event: any) => {
	  this._resetState()
	  const outputFile = excelApi.getFileNameWithExt(event)

	  if (outputFile) {
	    this.setState({ outputFile })
	    const schemes = this.INPUT_SCHEMES
	    const file = event.target.files[0]

	    const vas_list: any[] = []
	    let docs: IVAS[] = []
	    let lineNo = 0
	    let docRef: any
	    await excelApi.readFile(file, schemes, (record: IVAS) => {
	      this.setState({ numberOfRecord: this.state.numberOfRecord + 1 })
	      if (!docRef) {
	        docRef = record.DOCREF
	      }
	      if (record.LINO >= lineNo && docRef === record.DOCREF) {
	        lineNo = record.LINO
	        docs.push(record)
	      } else {
	        //calculate
	        this._calculate(docs, vas_list)

	        //reset docs
	        lineNo = record.LINO
	        docRef = record.DOCREF
	        docs = [record]
	      }
	    })
	    //lastone
	    this._calculate(docs, vas_list)

	    excelApi.toFile(vas_list, outputFile)
	    this._resetState()
	    this._changeEvent(event)
	  }
	}

	_changeEvent = (event: any) => {
	  //reset
	  const { target = {} } = event || {}
	  target.value = ''
	}

	_resetState = () => {
	  this.setState({ outputFile: null })
	}

	private _calculate(docs: IVAS[], vas_list: any[]): void {

	  const isOneCredit = docs.filter((d: any) => d.PSTAMT > 0).length
	  const isOneDebit = docs.filter((d: any) => d.PSTAMT < 0).length

	  if (isOneCredit === 0) {
	    console.log('case 1')
	    const jobs = _.cloneDeep(docs)
	    const lstDocs = _.sortBy(jobs, (d: any) => d.PSTAMT)
	    lstDocs.forEach((doc: any) => {
	      const debit = this._getDebit(doc)
	      debit.PSTAMT = Math.abs(doc.PSTAMT)
	      debit.ADTE08 = this._getDate(doc.ADTE08)
	      if (Math.abs(doc.PSTAMT)) {
	        vas_list.push(_.cloneDeep(debit))
	      }
	    })

	  } else if (isOneDebit === 0) {
	    console.log('case 2')
	    const jobs = _.cloneDeep(docs)
	    jobs.forEach((doc: any) => {
	      const credit = this._getCredit(doc)
	      credit.PSTAMT = Math.abs(doc.PSTAMT)
	      credit.ADTE08 = this._getDate(doc.ADTE08)
	      if (Math.abs(doc.PSTAMT)) {
	        vas_list.push(_.cloneDeep(credit))
	      }
	    })

	  } else if (isOneCredit === 1) {
	    console.log('case 3')
	    const jobs = _.cloneDeep(docs)
	    const creditIndex = jobs.findIndex((d: any) => d.PSTAMT > 0)
	    const creditRecords = jobs.splice(creditIndex, 1)
	    this._logDocRefNotEqual(creditRecords, jobs)

	    const credit = this._getCredit(creditRecords[0])
	    jobs.forEach((doc: any) => {
	      this._getCredit(credit, doc)
	      credit.PSTAMT = Math.abs(doc.PSTAMT)
	      credit.ADTE08 = this._getDate(doc.ADTE08)
	      if (Math.abs(doc.PSTAMT)) {
	        vas_list.push(_.cloneDeep(credit))
	      }
	    })

	  } else if (isOneDebit === 1) {
	    console.log('case 4')
	    const jobs = _.cloneDeep(docs)
	    const debitIndex = jobs.findIndex((d: any) => d.PSTAMT < 0)
	    const debitRecords = jobs.splice(debitIndex, 1)
	    this._logDocRefNotEqual(debitRecords, jobs)

	    const debit = this._getDebit(debitRecords[0])
	    jobs.forEach((doc: any) => {
	      this._getDebit(debit, doc)
	      debit.PSTAMT = Math.abs(doc.PSTAMT)
	      debit.ADTE08 = this._getDate(doc.ADTE08)
	      if (Math.abs(doc.PSTAMT)) {
	        vas_list.push(_.cloneDeep(debit))
	      }
	    })

	  }
	  // else if (isOneDebit === 2) {
	  // 	// console.log('case 5')
	  // 	const jobs = _.cloneDeep(docs)
	  // 	const lstDocs = _.sortBy(jobs, (d: any) => d.PSTAMT)
	  // 	let other: any = lstDocs.find((d: any) => d.PSTAMT < 0)
	  // 	let debit: any = lstDocs.filter((d: any) => d.PSTAMT < 0)[1]
	  // 	let lstCredit = lstDocs.filter((d: any) => d.PSTAMT > 0)

	  // 	let targetAmt = Math.abs(other.PSTAMT)
	  // 	let sumCredit = 0
	  // 	for (let index = 0; index < lstCredit.length; index++) {
	  // 		const credit = lstCredit[index];
	  // 		const creditAmt = Math.abs(credit.PSTAMT)
	  // 		if ((creditAmt + sumCredit) <= targetAmt) {
	  // 			sumCredit += creditAmt
	  // 		} else {
	  // 			if (sumCredit === targetAmt) {
	  // 				const lst1 = lstCredit.splice(0, index)
	  // 				this._calculate([other, ...lst1], vas_list)
	  // 				this._calculate([debit, ...lstCredit], vas_list)
	  // 			} else {

	  // 				const credit2 = _.cloneDeep(credit)
	  // 				credit2.PSTAMT = (targetAmt - sumCredit)
	  // 				credit.PSTAMT = creditAmt - (targetAmt - sumCredit)

	  // 				const lst1 = lstCredit.splice(0, index)
	  // 				this._calculate([other, credit2, ...lst1], vas_list)
	  // 				this._calculate([debit, ...lstCredit], vas_list)
	  // 			}
	  // 			break;
	  // 		}
	  // 	}

	  // } 
	  else {
	    console.log('case 5')
	    const jobs = _.cloneDeep(docs)
	    const ls_credit = _.sortBy(jobs.filter((d: any) => d.PSTAMT > 0), (d: any) => -1 * d.PSTAMT)
	    const ls_debit = _.sortBy(jobs.filter((d: any) => d.PSTAMT < 0), (d: any) => d.PSTAMT)

	    if (ls_debit.length >= ls_credit.length) {
	      let f_credit = ls_credit.shift()
	      while (f_credit) {
	        const total_Amt = f_credit.PSTAMT
	        const newDocs = [f_credit]
	        let foundAmt = 0


	        let debit = ls_debit.shift()
	        while (debit) {
	          const nextAmt = foundAmt + Math.abs(debit.PSTAMT)

	          if (nextAmt < total_Amt) {
	            foundAmt = nextAmt
	            newDocs.push(debit)
	            debit = ls_debit.shift()

	          } else if (nextAmt === total_Amt) {
	            newDocs.push(_.clone(debit))
	            this._calculate(_.cloneDeep(newDocs), vas_list)
	            this._calculate([..._.cloneDeep(ls_credit), ..._.cloneDeep(ls_debit)], vas_list)
	            return

	          } else {
	            const amt1 = total_Amt - foundAmt
	            const amt2 = Math.abs(debit.PSTAMT) - amt1

	            const new_debit1 = _.cloneDeep(debit)
	            const new_debit2 = _.cloneDeep(debit)

	            new_debit1.PSTAMT = -1 * amt1
	            newDocs.push(_.clone(new_debit1))

	            new_debit2.PSTAMT = -1 * amt2
	            ls_debit.push(_.clone(new_debit2))

	            this._calculate(_.cloneDeep(newDocs), vas_list)
	            this._calculate([..._.cloneDeep(ls_credit), ..._.cloneDeep(ls_debit)], vas_list)
	            return
	          }
	        }

	        f_credit = ls_credit.shift()
	      }
	    } else {
	      let f_debit = ls_debit.shift()
	      while (f_debit) {
	        const total_Amt = Math.abs(f_debit.PSTAMT)
	        const newDocs = [f_debit]
	        let foundAmt = 0

	        let credit = ls_credit.shift()
	        while (credit) {
	          const nextAmt = foundAmt + Math.abs(credit.PSTAMT)

	          if (nextAmt < total_Amt) {
	            foundAmt = nextAmt
	            newDocs.push(_.cloneDeep(credit))
	            credit = ls_credit.shift()

	          } else if (nextAmt === total_Amt) {
	            newDocs.push(_.clone(credit))
	            this._calculate(_.cloneDeep(newDocs), vas_list)
	            this._calculate([..._.cloneDeep(ls_credit), ..._.cloneDeep(ls_debit)], vas_list)
	            return

	          } else {
	            const amt1 = total_Amt - foundAmt
	            const amt2 = Math.abs(credit.PSTAMT) - amt1

	            const new_credit1 = _.cloneDeep(credit)
	            const new_credit2 = _.cloneDeep(credit)

	            new_credit1.PSTAMT = amt1
	            newDocs.push(_.clone(new_credit1))

	            new_credit2.PSTAMT = amt2
	            ls_credit.push(_.clone(new_credit2))

	            this._calculate(_.cloneDeep(newDocs), vas_list)
	            this._calculate([..._.cloneDeep(ls_credit), ..._.cloneDeep(ls_debit)], vas_list)
	            return
	          }
	        }

	        f_debit = ls_debit.shift()
	      }
	    }
	  }
	}

	_getDocsMatches = (docs: IVAS[], targetAmt: number) => {
	  let sumList: any = []
	  let sumAmt = 0
	  let sumObj: any = undefined

	  let index = 0
	  while (index < docs.length) {
	    const doc = docs[index++]
	    const obj: any = doc.LINDES_NO.trim()
	    //do at first time only
	    if (!sumObj) {
	      sumObj = doc.LINDES_NO.trim()
	    }

	    if (sumObj === obj) {
	      //continue
	      sumAmt += Math.abs(doc.PSTAMT)
	      sumList.push(doc)

	      if (sumAmt === targetAmt) {
	        //calculate
	        return sumList
	      }
	    } else {
	      sumAmt = Math.abs(doc.PSTAMT)
	      sumList = [doc]
	      sumObj = obj
	    }
	  }
	  return []
	}

	_logDocRefNotEqual = (credit: IVAS[], debit: IVAS[]) => {
	  const creditAmt = _.sumBy(credit, (_: any) => _.PSTAMT)
	  const debitAmt = _.sumBy(debit, (_: any) => _.PSTAMT)
	  if (Math.abs(creditAmt) !== Math.abs(debitAmt)) {
	    console.log(credit[0].DOCREF, creditAmt, debitAmt, '_logDocRefNotEqual')
	  }
	}

	_getDebit = (record: any, doc?: IVAS) => {
	  delete record.LINO
	  record.JOB_NO = doc?.JOB_NO
	  record.CENTER_NO = doc?.CENTER_NO
	  record.DEPT_NO = doc?.DEPT_NO
	  record.LINDES_NO = doc?.LINDES_NO
	  record.ACCN08_NO = doc?.ACCN08_NO
	  return record
	}
	_getCredit = (record: any, doc?: IVAS) => {
	  delete record.LINO
	  record.ACCN08_CO = doc?.ACCN08_CO
	  record.JOB_CO = doc?.JOB_CO
	  record.CENTER_CO = doc?.CENTER_CO
	  record.DEPT_CO = doc?.DEPT_CO
	  record.LINDES_CO = doc?.LINDES_CO
	  return record
	}

	_getDate(date: any) {
	  const dateStr = date + ''
	  if (dateStr && dateStr.length > 6) {
	    const year = dateStr.substring(1, 3)
	    const month = dateStr.substring(3, 5)
	    const day = dateStr.substring(5, 7)

	    return `${day}/${month}/20${year}`
	  } else {
	    return ''
	  }
	}

	_getSchemaFromStr = (headerStr: string) => {
	  const headerArr: any = this._toArray(headerStr)
	  if (headerArr.length) {
	    return this._toSchemaIndex(headerArr)
	  } else {
	    return {}
	  }
	}

	_toSchemaIndex = (headerArr: any[]) => {
	  const schema: any = {}
	  headerArr.forEach((key, index) => {
	    schema[key] = index
	  })
	  return schema
	}

	_toSchema = (headerArr: any[]) => {
	  const schema: any = {}
	  headerArr.forEach(key => {
	    schema[key] = key
	  })
	  return schema
	}

	_toArray = (headerStr: string) => {
	  if (headerStr) {
	    const headerArr = headerStr.split(/(\s+)/).filter(s => s)
	    if (headerArr && headerArr.length) {
	      return headerArr
	    } else {
	      return []
	    }
	  } else {
	    return []
	  }
	}


}