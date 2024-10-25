import { Spin, Flex } from "antd";

export const Spinner = () => {
  return (
    <Flex gap="middle" vertical>
      <Spin size="large">
        <h3
          style={{
            color: "#4db818",
            fontSize: "1.2em",
            textAlign: "center",
            marginTop: 180,
          }}
        >
          Please wait...
        </h3>
      </Spin>
    </Flex>
  );
};
