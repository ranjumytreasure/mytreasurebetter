import React, { useState } from 'react';
import styled from 'styled-components'
import data from '../components/data';
import SingleQuestion from '../components/Question';




const Faq = () => {
  const [questions, setQuestions] = useState(data);
  return (<Wrapper>
    <div className='contain'>
      <h3>Questions</h3>
      <section className='info'>
        {questions.map((question) => {
          return (
            <SingleQuestion key={question.id} {...question}></SingleQuestion>
          );
        })}
      </section>
    </div>

  </Wrapper>);
}
const Wrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
.contain {  
  max-width: 40rem;
    margin-top: 2rem;
    margin-bottom: 4rem;
padding-top: 35px;
display: flex;
flex-direction: column;
background: var(--clr-white);
border-radius: var(--radius);
box-shadow: var(--light-shadow);
transition: var(--transition);
padding: 2rem;
width: 90vw;
height: 1400px;
margin: 10 auto;
align-items: center;
}
.contain:hover {
    box-shadow: var(--dark-shadow);
  }
.contain h3 {
  line-height: 1.2;
  font-weight: 500;
}
@media screen and (min-width: 992px) {
  .container {
    display: grid;
    grid-template-columns: 250px 1fr;
  }
}
.question {
  padding: 1rem 1.5rem;
  border: 2px solid var(--clr-grey-special);
  margin-bottom: 1rem;
  border-radius: var(--radius);
  box-shadow: var(--light-shadow);
}
.question h4 {
  text-transform: none;
  line-height: 1.5;
}
.question p {
  color: var(--clr-grey-3);
  margin-bottom: 0;
  margin-top: 0.5rem;
}
.question header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.question header h4 {
  margin-bottom: 0;
}
.btn {
  background: transparent;
  border-color: transparent;
  width: 3rem;
  height: 3rem;
  background: var(--clr-red-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--clr-white);
  cursor: pointer;
  margin-left: 1rem;
  align-self: center;
  min-width: 2rem;
}
.question-text {
  white-space: pre-wrap; /* Preserve spaces and line breaks */
}
`
export default Faq
