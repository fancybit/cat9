using CommunityToolkit.Mvvm.Input;
using JadeClient.Models;

namespace JadeClient.PageModels
{
    public interface IProjectTaskPageModel
    {
        IAsyncRelayCommand<ProjectTask> NavigateToTaskCommand { get; }
        bool IsBusy { get; }
    }
}