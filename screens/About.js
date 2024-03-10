import React from "react";
import { View, Text } from "react-native";

import Header from "../components/Common/Header";
import StatusBarView from "../components/Common/StatusBarView";

const About = () => {
  return (
    <View>
      <StatusBarView backgroundColor="#1A2F5A" />
      <Header isHome={false} />
      <Text>Hayat Media BiH</Text>
    </View>
  );
};

export default About;
