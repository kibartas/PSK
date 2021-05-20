import React from 'react';
import Grid from '@material-ui/core/Grid';
import TopBar from "../TopBar/TopBar";
import UploadModal from "../UploadModal/UploadModal";
import './styles.css';
import VideoCardsByDate from "../VideoCardsByDate/VideoCardsByDate";
import NavDrawer from "../NavDrawer/NavDrawer";
import CustomSnackbar from "../CustomSnackbar/CustomSnackbar";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog/DeleteConfirmationDialog";

class VideoCardPage extends React.Component {
  render() {
    const {
      renderSnackbars,
      title,
      size,
      showNavDrawer,
      videosInformation,
      showUploadModal,
      showDeletionDialog,
      selectedCardIds,
      showDeletionError,
      iconsToShow,
      iconsToShowOnSelected,
      handleIconsClick,
      handleIconsClickOnSelected,
      sortedVideoDates,
      handleSelect,
      handleDateSelect,
      showDownloadInProgress,
      handleActionIconClick,
      toggleNavDrawer,
      toggleUploadModal,
      handleVideoDeletion,
      toggleDeletionDialog,
      hideDeletionError,
      deleteForever,
      children,
    } = this.props;

    return (
      <>
        {renderSnackbars()}
        <Grid
          className="root"
          style={{ height: videosInformation.length === 0 ? '100vh' : 'auto' }}
          container
          direction="column"
        >
          <NavDrawer
            open={showNavDrawer}
            onOpen={toggleNavDrawer}
            onClose={toggleNavDrawer}
            spaceTaken={size}
          />
          <UploadModal show={showUploadModal} onClose={toggleUploadModal} />
          <DeleteConfirmationDialog
            open={showDeletionDialog}
            onConfirm={handleVideoDeletion}
            onCancel={toggleDeletionDialog}
            multipleVideos={selectedCardIds.length > 1}
            deleteForever={deleteForever}
          />
          {showDeletionError && (
            <CustomSnackbar
              message={
                selectedCardIds.length === 1
                  ? 'Oops... Something wrong happened. We could not delete your video'
                  : 'Oops... Something wrong happened. Some videos might not have been deleted'
              }
              onClose={hideDeletionError}
              severity="error"
            />
          )}
          <Grid item>
            {selectedCardIds.length === 0 ? (
              <TopBar
                title={title}
                onActionIconClick={toggleNavDrawer}
                showAvatarAndLogout
                firstName={window.sessionStorage.getItem('firstName')}
                lastName={window.sessionStorage.getItem('lastName')}
                iconsToShow={iconsToShow}
                onIconsClick={handleIconsClick}
              />
            ) : (
              <TopBar
                title={`${selectedCardIds.length} ${
                  selectedCardIds.length === 1 ? 'video' : 'videos'
                } selected`}
                showArrow
                iconsToShow={iconsToShowOnSelected}
                onIconsClick={handleIconsClickOnSelected}
                onActionIconClick={handleActionIconClick}
                disableIcons={showDownloadInProgress}
              />
            )}
          </Grid>
          {Object.keys(videosInformation).length !== 0 ? (
            <Grid
              className="card_container"
              container
              item
              direction="column"
              spacing={5}
            >
              {sortedVideoDates.map((uploadDate) => (
                <VideoCardsByDate
                  key={uploadDate}
                  onSelect={handleSelect}
                  videosInformation={videosInformation[uploadDate]}
                  onSelectDate={handleDateSelect}
                  selectedCardIds={selectedCardIds}
                />
              ))}
            </Grid>
          ) : (
            <Grid container className="flex_grow">
              {children}
            </Grid>
          )}
        </Grid>
      </>
    );
  }
}

export default VideoCardPage;
