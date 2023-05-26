import React from 'react'
import { styled } from 'styled-components'

const StyledButton = styled.button`
    border: none;
    padding: 5px 12px;
    border-radius: 5px;
    background-color: ${props=> props.color};
    color: white;
`

export default function Button({children, ...rest}) {
  return (
    <StyledButton {...rest}>{children}</StyledButton>
  )
}
// Button에 color값을 기본 값으로 지정
Button.defaultProps = {
    color : "#001edf"
}