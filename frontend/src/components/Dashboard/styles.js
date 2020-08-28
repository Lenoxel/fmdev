import styled from 'styled-components';

export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 22vw;
  max-width: 22vw;
  border-style: ridge;
  padding: 30px;
`;

export const SelectContainer = styled.div`
  padding-bottom: 3vh;
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  padding-top: 0;
  margin: 2rem;
`;

export const Separator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 2vw;
  border-left: 2px dotted #000;
  height: 462px;
`;

export const GraphContainer = styled.div`
  max-width: 420px;
	margin: 0 auto;
	display: flex;
  background: white;
	justify-content: center;
	align-items: center;
`;

export const FlexItem = styled.div`
	flex: 1;
	margin: 5px;
	padding: 0 10px;
	text-align: center;
	font-size: 1.5em;
  border-style: ridge;
  position: relative;
  /* border: 1px solid midnightblue;
  border-radius: 3px; */
`;