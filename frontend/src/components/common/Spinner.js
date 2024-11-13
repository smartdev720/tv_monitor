import { Spin, Flex } from "antd";
import { useTranslation } from "react-i18next";

export const Spinner = () => {
  const { t } = useTranslation();
  return (
    <Flex gap="middle" vertical>
      <Spin size="large">
        <h3
          className="spinner"
          style={{
            fontSize: "1.2em",
            textAlign: "center",
            marginTop: 180,
            color: "#181818",
          }}
        >
          {t("pleaseWait")}
        </h3>
      </Spin>
    </Flex>
  );
};
