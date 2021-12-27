options({
  resultStreamName: "my_demo_projection_result",
  $includeLinks: false,
  processingLag: 0,
  reorderEvents: false,
});
fromStream("account-1")
  .when({
    $init: function () {
      return { prop1: "", count: 0, Total: 0 };
    },
    TotoEvent: function (state, event) {
      state.count++;
      state.prop1 = "blabla";
    },
  })
  .transformBy((state) => {
    return {
      Total: state.count,
    };
  })
  .outputState();
