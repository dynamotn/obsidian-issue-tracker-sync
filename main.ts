import {
  App,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface IssueTrackerSyncSettings {
  targetFolder: string;
}

const DEFAULT_SETTINGS: IssueTrackerSyncSettings = {
  targetFolder: "",
};

export default class IssueTrackerSync extends Plugin {
  settings: IssueTrackerSyncSettings;

  async onload() {
    await this.loadSettings();

    // This creates an icon in the left ribbon.
    this.addRibbonIcon(
      "dice",
      "Sync from Issue trackers",
      (evt: MouseEvent) => {
        // Called when the user clicks the icon.
        new Notice("Sync issues successfully!");
      },
    );

    // This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: "sync-issue-trackers",
      name: "Sync from Issue trackers",
      callback: () => {},
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new IssueTrackerSyncSettingTab(this.app, this));

    // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // Using this function will automatically remove the event listener when this plugin is disabled.
    this.registerDomEvent(document, "click", (evt: MouseEvent) => {
      console.log("click", evt);
    });

    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    this.registerInterval(
      window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000),
    );
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class IssueTrackerSyncSettingTab extends PluginSettingTab {
  plugin: IssueTrackerSync;

  constructor(app: App, plugin: IssueTrackerSync) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Target Folder (optional)")
      .setDesc(
        "The relative path to the parent folder to sync from issue trackers",
      )
      .addText((text) =>
        text
          .setPlaceholder("Enter target folder")
          .setValue(this.plugin.settings.targetFolder)
          .onChange(async (value) => {
            this.plugin.settings.targetFolder = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
