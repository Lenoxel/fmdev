import styled from 'styled-components';

export const Item = styled.button`
  border: 0;
  background: transparent;
`;

export const ChipContainer = styled.div`
  span {
    font-family: Avenir, sans-serif;
    font-size: 15px;
  }
`;

export const CardContainer = styled.div`
  margin: 5px 10px;
  display: flex;
  flex-wrap: wrap;
  /* background: white;
  border-radius: 5px; */
`;

export const MainContainer = styled.div`
  width: 100%;
  min-height: 100%;
	margin: 0 auto;
	display: flex;
	/* border: 1px solid #ccc; */
	/* flex-wrap: wrap; */
  justify-content: flex-start;
`;

export const AsideContainer = styled.aside`
  /* height: 100%; */
  background: white;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 20vw;
  max-width: 20vw;
  padding: 20px;
  margin-bottom: 10px;

  h1 {
    padding-bottom: 15px;
    font-weight: 600;
    font-size: 24px;
    line-height: 31px;
    color: #4A5173;
  }
`;

export const DashboardMainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const FullContainer = styled.div`
  width: 100%;
	padding: 10px;
  display: flex;
	/* text-align: center; */
  border-radius: 5px;
  /* box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1); */

  h1 {
    padding-bottom: 15px;
    font-weight: 600;
    font-size: 24px;
    line-height: 31px;
    color: white;
  }
`;

export const LeftContentInside = styled.div`
  display: flex;
  flex-direction: column;
  width: 16vw;
  max-width: 16vw;
  padding: 20px;
  margin-bottom: 10px;
  margin-top: 25px; 
  margin-left: 10px; 
  height: 80%;
  border: 2px solid #4A5173;
`;

export const FlexInside = styled.div`
  display: flex;
`;

export const SelectContainer = styled.div`
  padding-bottom: 3vh;
  width: 100%;
`;

export const Content = styled.div`
  /* display: flex; */
  padding-top: 0;
  /* width: 50%; */
  margin: 0 10px;
  /* margin: 0 2rem 1rem; */
`;

export const HalfContent = styled.div`
  /* display: flex; */
  padding-top: 0;
  width: 50%;
  margin: 0 10px;
  /* margin: 0 2rem 1rem; */
`;

export const CustomizedContent = styled.div`
  padding-top: 0;
  margin: 0 10px;
`;

export const Separator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 2vw;
  /* border-left: 2px dotted #000; */
  height: 462px;
`;

export const GraphContainer = styled.div`
  max-width: 420px;
	margin: 10px auto;
  padding-top: 5px;
	display: flex;
  background: white;
	justify-content: center;
	align-items: center;
`;

export const GraphContainerInside = styled.div`
	margin: 15px;
  padding-top: 5px;
  background: white;
	justify-content: center;
	align-items: center;
`;

export const ExternalLoadingContainer = styled.div`
  max-width: 420px;
	margin: 0 auto;
	display: flex;
  /* background: white; */
	justify-content: center;
	align-items: center;
`;

export const FlexItem = styled.div`
	flex: 1;
	margin: 5px;
	padding: 10px;
	text-align: center;
	/* font-size: 1.5em; */
  position: relative;
  border-radius: 5px;
  border: 2px solid #4A5173;
  /* background: #4A5173; */
`;

export const TabsContainer = styled.div`
  flex-grow: 1;
  border: 2px solid #4A5173;
  /* background: #4A5173; */
  margin: 40px;
`;