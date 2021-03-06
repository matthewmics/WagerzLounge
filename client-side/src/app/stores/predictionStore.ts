import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IPrediction, IPredictionCreateForm } from "../models/prediction";
import { RootStore } from "./rootStore";

export default class PredictionStore {

  rootStore: RootStore;

  @observable selectedPrediction: IPrediction | null = null;
  @observable loading = false;
  @observable targetLoading = '' as any;

  constructor(rootStore: RootStore) {
    makeObservable(this);
    this.rootStore = rootStore;
  }

  getMatch = () => {
    return this.rootStore.matchStore.selectedMatch!;
  }
  getPrediction = (predictionId: number) => {
    return this.getMatch().predictions.filter(x => x.id === predictionId)[0];
  }

  @action selectPrediction = (id: number) => {
    this.selectedPrediction = this.rootStore.matchStore.selectedMatch!.predictions.filter(p => p.id === id)[0];

    this.loadPredictionDetails();
  }

  @action unpredict = async () => {
    this.loading = true;
    try {
      await agent.Predictions.unpredict(this.selectedPrediction!.id);
      runInAction(() => {
        this.rootStore.userStore.user!.walletBalance += this.selectedPrediction!.predictionDetails.activePrediction!.amount;
        this.selectedPrediction!.predictionDetails.activePrediction = null;
      });
      toast.info("You have cancelled prediction");
      this.rootStore.matchStore.loadRecentMatchPredictions();
    } catch (error) {
      this.rootStore.modalStore.openErrorModal(error, 'Could not cancel prediction')
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action predict = async (teamId: number, amount: number) => {
    this.loading = true;
    try {
      const activePrediction = await agent.Predictions.predict(
        this.selectedPrediction!.id,
        teamId,
        amount);

      runInAction(() => {
        this.rootStore.userStore.user!.walletBalance -= activePrediction.amount;
        this.selectedPrediction!.predictionDetails.activePrediction = activePrediction;
      })

      this.rootStore.modalStore.closeModal();
      toast.success("Prediction successful");
      this.rootStore.matchStore.loadRecentMatchPredictions();

    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action updatePrediction = async (teamId: number, amount: number) => {
    this.loading = true;
    try {
      const activePrediction = await agent.Predictions.updatePrediction(
        this.selectedPrediction!.id,
        teamId,
        amount);

      runInAction(() => {
        this.rootStore.userStore.user!.walletBalance +=
          this.selectedPrediction!.predictionDetails.activePrediction!.amount -
          activePrediction.amount;

        this.selectedPrediction!.predictionDetails.activePrediction = activePrediction;
      })

      this.rootStore.modalStore.closeModal();
      toast.success("Prediction updated");
      this.rootStore.matchStore.loadRecentMatchPredictions();

    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action setLive = async (predictionId: number) => {
    this.loading = true;
    this.targetLoading = predictionId;
    try {
      await agent.Predictions.setLive(predictionId);
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action reschedule = async (predictionId: number, schedule: string) => {
    this.loading = true;
    try {
      await agent.Predictions.reschedule(predictionId, schedule);
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action settle = async (predictionId: number, teamId: number) => {
    this.loading = true;
    try {
      await agent.Predictions.settle(predictionId, teamId);
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action cancel = async (predictionId: number) => {
    this.targetLoading = predictionId;
    this.loading = true;
    try {
      await agent.Predictions.cancel(predictionId);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while processing your request")
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action create = async (formValues: IPredictionCreateForm) => {
    this.loading = true;
    try {
      await agent.Predictions.create(formValues);
      // prediction.startDate = new Date(prediction.startDate);
      // const match = this.getMatch();
      // runInAction(() => {
      //   match.predictions.push(prediction);
      // });
      // toast.success("Prediction created");
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }


  @action loadPredictionDetails = async () => {
    this.loading = true;
    try {
      const predictionDetails = await agent.Predictions
        .predictionDetails(this.selectedPrediction!.id);
      runInAction(() => {
        this.selectedPrediction!.predictionDetails = predictionDetails;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action readNotification = async (id: number) => {
    try {
      await agent.Predictions.readNotification(id);
    } catch (error) {
      console.log(error)
    }
  }
}