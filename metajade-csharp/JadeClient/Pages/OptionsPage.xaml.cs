namespace JadeClient.Pages;

public partial class OptionsPage : ContentPage
{
    public OptionsPage(SettingsPageModel model)
    {
        InitializeComponent();
        BindingContext = model;
    }
}