import React, { useState } from "react";
import { Card, Button, Input } from "src/components/common";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteTitle: "ITPEC Exam Test",
    siteDescription: "Practice exams for ITPEC certification",
    maxQuizTime: 180,
    questionsPerPage: 10,
    enableRegistration: true,
    maintenanceMode: false,
  });

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Here you would save to database
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      siteTitle: "ITPEC Exam Test",
      siteDescription: "Practice exams for ITPEC certification",
      maxQuizTime: 180,
      questionsPerPage: 10,
      enableRegistration: true,
      maintenanceMode: false,
    });
  };

  return (
    <div className="admin-settings">
      <div className="container">
        <div className="admin-settings__header">
          <h1 className="admin-settings__title">Admin Settings</h1>
          <p className="admin-settings__subtitle">
            Configure system settings and preferences
          </p>
        </div>

        <div className="admin-settings__content">
          <Card className="admin-settings__card">
            <h2 className="admin-settings__section-title">General Settings</h2>
            <div className="admin-settings__form">
              <Input
                label="Site Title"
                value={settings.siteTitle}
                onChange={(e) => handleInputChange("siteTitle", e.target.value)}
                placeholder="Enter site title"
              />
              <Input
                label="Site Description"
                value={settings.siteDescription}
                onChange={(e) =>
                  handleInputChange("siteDescription", e.target.value)
                }
                placeholder="Enter site description"
              />
            </div>
          </Card>

          <Card className="admin-settings__card">
            <h2 className="admin-settings__section-title">Quiz Settings</h2>
            <div className="admin-settings__form">
              <Input
                label="Maximum Quiz Time (minutes)"
                type="number"
                value={settings.maxQuizTime}
                onChange={(e) =>
                  handleInputChange("maxQuizTime", parseInt(e.target.value))
                }
                min="30"
                max="300"
              />
              <Input
                label="Questions Per Page"
                type="number"
                value={settings.questionsPerPage}
                onChange={(e) =>
                  handleInputChange(
                    "questionsPerPage",
                    parseInt(e.target.value)
                  )
                }
                min="1"
                max="50"
              />
            </div>
          </Card>

          <Card className="admin-settings__card">
            <h2 className="admin-settings__section-title">System Settings</h2>
            <div className="admin-settings__form">
              <div className="admin-settings__checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.enableRegistration}
                    onChange={(e) =>
                      handleInputChange("enableRegistration", e.target.checked)
                    }
                  />
                  Enable User Registration
                </label>
              </div>
              <div className="admin-settings__checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      handleInputChange("maintenanceMode", e.target.checked)
                    }
                  />
                  Maintenance Mode
                </label>
              </div>
            </div>
          </Card>

          <div className="admin-settings__actions">
            <Button onClick={handleReset} variant="secondary">
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} variant="primary">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
