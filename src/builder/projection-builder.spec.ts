import { ProjectionBuilder } from "./projection-builder";
import { ProjectionOptions } from "../options";
import { format } from "prettier";
import { EventTypeHandler, InitHandler } from "../handlers";
import { ProjectionState } from "./projection.state";
import * as fs from "fs";
import {
  FromAllSelector,
  FromCategorySelector,
  FromStreamSelector,
  FromStreamsSelector,
} from "../selectors";
import {
  FilterByFilter,
  OutputStateFilter,
  PartitionByFilter,
  TransformByFilter,
  WhenFilter,
} from "../filters";
import {
  EXTERNAL_STRING,
  EXTERNAL_VALUE,
  EXTERNAL_VALUES,
} from "./projection-builder.spec.helper";
import { GlobalObject } from "./global-object";

describe("ProjectionBuilder", () => {
  let builder: ProjectionBuilder;

  const options: ProjectionOptions = new ProjectionOptions({
    resultStreamName: "ijiji",
    $includeLinks: true,
    processingLag: 1000,
    reorderEvents: true,
  });

  beforeEach(() => {
    builder = new ProjectionBuilder();
  });

  it("should add the given option before the projection when exporting", () => {
    builder = builder.addOptions(options);
    expect(builder.exportProjection()).toEqual(
      tsFormat(
        `options({resultStreamName: 'ijiji',$includeLinks: true,processingLag: 1000,reorderEvents: true,})`
      )
    );
  });

  it("should show fromAll selector when exporting", () => {
    const selector: FromAllSelector = new FromAllSelector();
    builder = builder.addSelector(selector);
    expect(builder.exportProjection()).toEqual(tsFormat(`fromAll();`));
  });

  it("should show fromCategory selector whith category argument when exporting", () => {
    const selector: FromCategorySelector = new FromCategorySelector("test");
    builder = builder.addSelector(selector);
    expect(builder.exportProjection()).toEqual(
      tsFormat(`fromCategory("test");`)
    );
  });

  it("should show fromStream selector with streamId when exporting", () => {
    const selector: FromStreamSelector = new FromStreamSelector("test");
    builder = builder.addSelector(selector);
    expect(builder.exportProjection()).toEqual(tsFormat(`fromStream("test")`));
  });

  it("should show fromStreams selector with streams when exporting", () => {
    const selector: FromStreamsSelector = new FromStreamsSelector([
      "test1",
      "test2",
      "test3",
    ]);
    builder = builder.addSelector(selector);
    expect(builder.exportProjection()).toEqual(
      tsFormat(`fromStreams("test1", "test2", "test3")`)
    );
  });

  it("should be able to chain outputState filter when building a projection", () => {
    builder = builder.addSelector(new FromAllSelector()).addOptions(options);

    expect(builder.exportProjection()).toEqual(
      tsFormat(
        `${format(
          `options({resultStreamName: 'ijiji',$includeLinks: true,processingLag: 1000,reorderEvents: true,})`,
          { parser: "typescript" }
        )}fromAll()`
      )
    );
  });

  it("should be able to chain a foreachStream filter when building a projection", () => {
    const projection = builder
      .addSelector(new FromAllSelector())
      .addFilter(new OutputStateFilter())
      .exportProjection();

    expect(projection).toEqual(tsFormat(`fromAll().outputState()`));
  });

  it(`should be able to add function helper in the global space of the projection`, () => {
    function tutu(plop: string): string {
      return 123 + plop;
    }
    const projection = builder
      .addGlobalObject(new GlobalObject("tutu", tutu))
      .exportProjection();

    expect(projection).toEqual(
      tsFormat(`function tutu(plop) { return 123 + plop; }`)
    );
  });

  it(`should be able to import external constants when it's a number`, () => {
    const projection = builder
      .addGlobalObject(new GlobalObject("EXTERNAL_VALUE", EXTERNAL_VALUE))
      .exportProjection();

    expect(projection).toEqual(tsFormat(`const EXTERNAL_VALUE = 123`));
  });

  it(`should be able to import external constants when it's a string`, () => {
    const projection = builder
      .addGlobalObject(
        new GlobalObject("EXTERNAL_STRING", EXTERNAL_STRING, "string")
      )
      .exportProjection();

    expect(projection).toEqual(
      tsFormat(`const EXTERNAL_STRING = 'external string'`)
    );
  });

  it(`should be able to import external constants as array`, () => {
    const projection = builder
      .addGlobalObject(
        new GlobalObject("EXTERNAL_VALUES", EXTERNAL_VALUES, "array")
      )
      .exportProjection();

    expect(projection).toEqual(`const EXTERNAL_VALUES = ["test", "tutu"];\n`);
  });

  it(`should be able to add const method helper in the global space of the projection`, () => {
    const tutu = (plop: string): string => {
      return 123 + plop;
    };
    const projection = builder
      .addGlobalObject(new GlobalObject("tutu", tutu))
      .exportProjection();

    expect(projection).toEqual(
      tsFormat(`const tutu = (plop) => { return 123 + plop; }`)
    );
  });

  it("should be able to chain a partitionBy filter when building a projection$", () => {
    const projection = builder
      .addSelector(new FromAllSelector())
      .addFilter(new PartitionByFilter((event) => null))
      .exportProjection();

    expect(projection).toEqual(
      tsFormat(`fromAll().partitionBy((event) => null);`)
    );
  });

  it("should be able to chain a transformBy filter when building a projection$", () => {
    const projection = builder
      .addSelector(new FromAllSelector())
      .addFilter(new TransformByFilter((state) => null))
      .exportProjection();

    expect(projection).toEqual(
      tsFormat(`fromAll().transformBy((state) => null);`)
    );
  });

  it("should be able to chain a filterBy filter when building a projection$", () => {
    const projection = builder
      .addSelector(new FromAllSelector())
      .addFilter(new FilterByFilter((state) => null))
      .exportProjection();

    expect(projection).toEqual(
      tsFormat(`fromAll().filterBy((state) => null);`)
    );
  });

  it("should be able to chain a when filter when building a projection", () => {
    class State extends ProjectionState {
      prop1: string;
      prop2 = 0;
    }

    class TotoEvent {
      id: string;
      date: Date;
    }

    const totoHandlerCallback = (state: State, event: TotoEvent): void => {
      state.prop2++;
      state.prop1 = "blabla";
    };

    const init: InitHandler<State> = new InitHandler<State>(new State());
    const totoEventHandler: EventTypeHandler<State, TotoEvent> =
      new EventTypeHandler<State, TotoEvent>("TotoEvent", totoHandlerCallback);
    const projection: string = builder
      .addSelector(new FromAllSelector())
      .addFilter(new WhenFilter([init, totoEventHandler]))
      .exportProjection();

    expect(projection.indexOf("$init")).not.toEqual(-1);
    expect(projection.indexOf("TotoEvent")).not.toEqual(-1);
  });

  it("should export the projection properly", () => {
    class State extends ProjectionState {
      prop1 = "";
      count = 0;
      Total = 0;
    }

    class TotoEvent {
      id: string;
      date: Date;
    }

    const totoHandlerCallback = (state: State, event: TotoEvent): void => {
      state.count++;
      state.prop1 = "blabla";
    };

    const transformByCallBack = (state: State) => {
      return { Total: state.count };
    };

    const state: State = new State();
    const projectionBuilder = new ProjectionBuilder();
    projectionBuilder
      .addSelector(new FromStreamSelector("account-1"))
      .addOptions(
        new ProjectionOptions({
          resultStreamName: "my_demo_projection_result",
          $includeLinks: false,
          reorderEvents: false,
          processingLag: 0,
        })
      )
      .addFilter(
        new WhenFilter([
          new InitHandler(state),
          new EventTypeHandler<State, TotoEvent>(
            "TotoEvent",
            totoHandlerCallback
          ),
        ])
      )
      .addFilter(new TransformByFilter(transformByCallBack))
      .addFilter(new OutputStateFilter());

    const expectedProjection = fs.readFileSync(
      __dirname + "/example.projection.spec.js",
      {
        encoding: "utf-8",
      }
    );
    expect(expectedProjection).toEqual(projectionBuilder.exportProjection());
  });
});

const tsFormat = (rawStr) => format(rawStr, { parser: "typescript" });
