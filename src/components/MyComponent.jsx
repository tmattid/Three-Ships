import { React, useEffect, useState } from 'react'
import { Paper, Input, Box, Typography, Button } from '@mui/material'
import * as DataService from '../services/DataService'

function getRandomWord(array) {
  return array[Math.floor(Math.random() * array.length)]
}

//String Parser//
function parseStr(input, objWithValues) {
  let output = ''
  let variable = ''
  let arrayLikeString = ''

  let variableFlag = false
  let arrayFlag = false

  for (const char of input) {
    //loop through array of characters
    if (char === '{') {
      console.log(char)

      variableFlag = true //if '{' begin variable
      continue
    }

    if (char === '}') {
      variableFlag = false //if '}' end of variable

      output += objWithValues[variable] || 'null'
      variable = ''
      console.log(variable, output)
      continue
    }

    if (char === '[') {
      arrayFlag = true
      continue
    }
    if (char === ']') {
      arrayFlag = false
      output += getRandomWord(arrayLikeString.split('|')) //take output, split into separate words
      arrayLikeString = ''
      continue
    }

    if (variableFlag) {
      variable += char
    } else if (arrayFlag) {
      arrayLikeString += char
    } else {
      output += char
    }
  }
  console.log({
    output,
    variable,
    arrayLikeString,
  })
  return output
}

const MyComponent = () => {
  const [productData, setProductData] = useState({
    //Set object properties into state
    productObj: [],
    pd: [],
    filterProd: [],
    value: 'typemaster2000:',
    type: '',
    coolfactor: 0,
    features: '',
    name: '',
    price: '',
  })
  
  const [parsedString, setParsedString] = useState('')
  const [typedInput, setTypedInput] = useState(
    'Ex: The {name} is [cool | awesome | fun]',
  )

  //Axios get call after initial render
  useEffect(() => {
    DataService.getData().then(onGetDataSuccess).catch(onGetDataError)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Get Product Data from API
  const onGetDataSuccess = (res) => {
    console.log(productData)
    let pd = res.data
    // console.log(pd)
    let pd2 = pd[`${productData.value}`]
    // console.log(pd2)

    setProductData((preState) => {
      let updated = {
        ...preState,
        ProductObj: res.data,
        pd: pd2,
        type: productData.value,
      }

      return updated
    })
  }

  //On change of list, get value so as to filter by product
  const onProductChange = (e) => {
    const target = e.target
    const value = target.value
    console.log(value)

    const newArr = productData.ProductObj
    const filteredProducts = newArr[`${value}`]

    //Update Stay with Product Selection
    setProductData((preState) => {
      let updated = {
        ...preState,
        pd: filteredProducts,
      }
      return updated
    })
  }

  const onGetDataError = (err) => {
    console.log(err, 'Data Retrieval Failure')
  }

  let obj = {
    coolfactor: 0,
    features: '',
    name: '',
    price: '',
  }

  console.log(obj)

  let startingString = ''

  let output = parseStr(startingString, obj)
  console.log(output)

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: '',
        m: 'auto',
        marginTop: '5px',
        width: '98%',
        height: 'auto',
        minHeight: 500,
      }}
      elevation={0}
    >
      <Box>
        <Paper
          elevation={24}
          sx={{
            width: 500,
            height: 250,
            border: '1px solid grey',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box sx={{ m: 1, width: '100%' }}>
            {' '}
            <div>Product Selector</div>
            <select
              name="type"
              id="type"
              sx={{ maxHeight: 100 }}
              onChange={onProductChange}
            >
              <option value="typemaster2000:">typemaster2000</option>
              <option value="typemaster3000:">typemaster3000</option>
            </select>
            <Typography name="coolfactor" id="coolfactorId">
              Coolfactor: {productData.pd.coolfactor}
            </Typography>
            <Typography name="features" id="featuresId">
              Features: {productData.pd.features}
            </Typography>
            <Typography name="price" id="priceId">
              Price: {productData.pd.price}
            </Typography>
            <Typography margin={'5%'} name="price" id="priceId">
              {parsedString}
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Box
        sx={{
          flex: 0,
          flexDirection: 'row',
        }}
      >
        <Paper
          elevation={24}
          sx={{ width: 500, height: 60, border: '1px solid grey' }}
        >
          <Input
            id="Sentences"
            spellCheck={true}
            lang={'en'}
            value={typedInput}
            sx={{ width: '75%', ml: '5%', mt: 1 }}
            onChange={(e) => setTypedInput(e.target.value)}
          ></Input>
          <Button
            type="Primary"
            sx={{ border: '1px solid blue', m: 1 }}
            onClick={() => {
              setParsedString(parseStr(typedInput, productData.pd)) //pass in string & productData from state
            }}
          >
            Parse
          </Button>
        </Paper>
      </Box>
    </Paper>
  )
}

export default MyComponent
