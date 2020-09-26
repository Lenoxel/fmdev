import styled from 'styled-components';

export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 22vw;
  max-width: 22vw;
  border-style: ridge;
  padding: 20px;
  margin-bottom: 10px;
`;

export const LeftContentInside = styled.div`
  display: flex;
  flex-direction: column;
  width: 18vw;
  max-width: 18vw;
  padding: 20px;
  margin-bottom: 10px;
  margin-top: 25px; 
  margin-left: 10px; 
  border-style: outset; 
  height: 80%
`;

export const FlexInside = styled.div`
  display: flex;
`;

export const SelectContainer = styled.div`
  padding-bottom: 3vh;
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  padding-top: 0;
  margin: 0 2rem 1rem;
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
	margin: 10px auto;
  padding-top: 5px;
	display: flex;
  background: aliceblue;
	justify-content: center;
	align-items: center;
`;

export const GraphContainerInside = styled.div`
	margin: 10px 3px;
  padding-top: 5px;
  background: aliceblue;
	justify-content: center;
	align-items: center;
`;

export const ExternalLoadingContainer = styled.div`
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
  position: relative;
`;

export const TabsContainer = styled.div`
  flex-grow: 1;
  background: aliceblue;
  border-style: ridge;
  margin: 0 10px 10px
`;